import { ref } from 'vue'

const countriesCache = ref([])
const isLoading = ref(false)
const error = ref(null)

export async function fetchCountries() {
  if (countriesCache.value.length > 0) {
    return countriesCache.value
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')

    if (!response.ok) {
      throw new Error('Failed to fetch countries')
    }

    const data = await response.json()

    // Transform to dropdown format and sort alphabetically
    const countries = data
      .map((country) => ({
        value: country.cca2,
        title: country.name.common,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))

    // Cache the results
    countriesCache.value = countries

    return countries
  } catch (err) {
    error.value = err.message
    console.error('Error fetching countries:', err)

    // Return fallback with common countries if API fails
    return [
      { value: 'PH', title: 'Philippines' },
      { value: 'US', title: 'United States' },
      { value: 'GB', title: 'United Kingdom' },
      { value: 'JP', title: 'Japan' },
      { value: 'CN', title: 'China' },
      { value: 'SG', title: 'Singapore' },
      { value: 'AU', title: 'Australia' },
    ]
  } finally {
    isLoading.value = false
  }
}

export function getCountryName(code) {
  const country = countriesCache.value.find((c) => c.value === code)
  return country?.title || code
}

export { countriesCache, isLoading, error }
