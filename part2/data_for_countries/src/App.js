import axios from "axios"
import { useEffect, useState } from "react"

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState()
  const app_id = process.env.REACT_APP_WEATHER_API_KEY

  useEffect(() => {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${app_id}&units=metric`
      )
      .then((response) => setWeather(response.data))
  }, [])
  
  const getWeatherIcon = () => {
    return `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  }

  if (weather === undefined) {
    return <div></div>
  }

  return (
    <div>
      <h1>Weather in {capital}</h1>
      <p>temperature {weather.main.temp} Celsius</p>
      {<img src={getWeatherIcon()} />}
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Countries = ({ filteredCountries, setFilter }) => {
  const handleFilterCountry = (countryName) => () => setFilter(countryName)

  if (filteredCountries.length > 10){
    return "Too many matches, specify another filter"
  } else if (filteredCountries.length <= 10){
    if (filteredCountries.length === 1){
      return <CountryData country={filteredCountries[0]} />
    }
    else{
      return filteredCountries.map((country) => (
        <p key={country.name.common}>
          {country.name.common}
          <button onClick={handleFilterCountry(country.name.common)}>show</button>
        </p>
      ))
    }
  }
}

const Languages = ({ languages }) => {
  let languagesValue = []
  for (let language in languages) {
    languagesValue = languagesValue.concat(languages[language])
  }
  return languagesValue.map((language) => <li key={language}>{language}</li>)
}

const CountryData = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <b>languages:</b>
      <ul>
        <Languages languages={country.languages} />
      </ul>
      <img src={country.flags.png} />
      <Weather capital={country.capital[0]} />
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState("")
  const [countries, setCountries] = useState([])

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  const handleFilterChange = (event) => setFilter(event.target.value)

  const getCountries = () => {
    return axios.get("https://restcountries.com/v3.1/all").then((response) => response.data)
  }

  useEffect(() => {
    getCountries().then((countries) => setCountries(countries))
  }, [])

  return (
    <div>
      <p>find countries: <input value={filter} onChange={handleFilterChange} /></p>
      <Countries filteredCountries={filteredCountries} setFilter={setFilter} />
    </div>
  )
}

export default App