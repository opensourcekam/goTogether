const React = require('react');
const axios = require('axios');

class Pickers extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currencies: [],
      locales: [],
      countries: [],
      selectedCurrency: '',
      selectedLocale: '',
      selectedCountry: ''
    };
    this.getCurrencies = this.getCurrencies.bind(this);
    this.getLocales = this.getLocales.bind(this);
    this.getCountries = this.getCountries.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
  }

  componentDidMount () {
    this.getCurrencies();
    this.getLocales();
  }

  componentWillMount () {}

  getCurrencies () {
    axios.get('/currencies').then((value) => {
      this.setState({currencies: value.data});
    }).catch((err) => {
      throw new Error('Could not get currencies');
    });
  }

  getLocales () {
    axios.get('/locales').then((value) => {
      this.setState({locales: value.data});
    }).catch((err) => {
      console.err(err);
      throw new Error('Could not get locales');
    });
  }

  getCountries (locale) {
    axios.get('/countries', {
      params: {
        locale: locale
      }
    }).then((value) => {
      this.setState({countries: value.data});
    }).catch((err) => {
      console.err(err);
      throw new Error('Could not get countries');
    });
  }

  handleChange (e) {
    let type = e.target.id;
    let value = e.target.value;

    switch (type) {
      case 'currencies':
        this.setState({selectedCurrency: value});
        axios.put(`/api/v1/user/${userJSON.id}`, {
          update: {
            type: 'currency',
            value: value
          }
        }).then((json) => {
          console.log(json);
        });
        break;
      case 'locales':
        this.setState({selectedLocale: value});
        this.getCountries(value);
        axios.put(`/api/v1/user/${userJSON.id}`, {
          update: {
            type: 'locale',
            value: value
          }
        }).then((json) => {
          console.log(json);
        });
        break;

      case 'countries':
        this.setState({selectedCountry: value});
        axios.put(`/api/v1/user/${userJSON.id}`, {
          update: {
            type: 'country',
            value: value
          }
        }).then((json) => {
          console.log(json);
        });
        break;

      default:
        return;
    }
    console.log(this.state);
  }

  handleCurrencyChange (e) {
    let type = e.target.id;
    let currency = e.target.value;
    this.setState({selectedCurrency: currency});
  }

  render () {
    const {currencies, locales, countries} = this.state;
    const currencyElements = currencies.map((guap) => {
      const {Code, Symbol} = guap;
      return <option value={Code} key={`${Code}${Symbol}`}>{Code}</option>;
    });

    const localeElements = locales.map((locale) => {
      const {Code, Name} = locale;
      return <option value={Code} key={Code}>{Name}</option>;
    });

    const countryElements = countries.map((country) => {
      const {Code, Name} = country;
      return <option value={Code} key={Code}>{Name}</option>;
    });

    return (
      <div>
        <select onChange={this.handleChange} className='dropdown' id='currencies'>
          Currencies {currencyElements}
        </select>
        <select onChange={this.handleChange} className='dropdown' id='locales'>
          Locales {localeElements}
        </select>
        {(this.state.selectedLocale)
          ? <select onChange={this.handleChange} className='dropdown' id='countries'>
              Countries {countryElements}
          </select>
          : null}
        <div>
          {/* <p>{this.state.selectedCurrency}</p>
          <p>{this.state.selectedLocale}</p> */}
        </div>
      </div>
    );
  }
}

module.exports = Pickers;
