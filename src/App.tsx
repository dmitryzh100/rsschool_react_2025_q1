import React from 'react';
import SearchForm from './layout/SearchForm/SearchForm';
import SWAPIService from './service/SWAPIService';
import { type Character } from './types/types';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import SearchResults from './layout/SearchResults/SearchResults';

interface State {
  searchTerm: string;
  results: Character[];
  isLoading: boolean;
  error: string | null;
  isTriggeredError: boolean;
}

class App extends React.Component<Record<string, never>, State> {
  #searchService = new SWAPIService();

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem('searchTerm') || '',
      results: [],
      isLoading: false,
      error: null,
      isTriggeredError: false,
    };
  }

  fetchData = async (inputValue: string) => {
    this.setState({ isLoading: true, error: null });

    const response = await this.#searchService.search(inputValue);

    if ('error' in response) {
      this.setState({
        error: response.errorInfo,
        isLoading: false,
      });
    } else {
      this.setState({
        results: response.results,
        isLoading: false,
      });
    }
  };

  handleSearch = (inputValue: string) => {
    this.setState({
      isLoading: true,
      error: null,
    });

    localStorage.setItem('searchTerm', inputValue);
    this.fetchData(inputValue);
  };

  handleErrorBoundaryTrigger = () => {
    this.setState({ isTriggeredError: true });
  };

  componentDidMount() {
    this.fetchData(this.state.searchTerm);
  }

  render() {
    if (this.state.isTriggeredError) {
      throw new Error('Testing error boundary');
    }

    return (
      <>
        <Header className="header">
          <SearchForm
            isLoading={this.state.isLoading}
            searchTerm={this.state.searchTerm}
            onSearch={this.handleSearch}
          />
        </Header>
        <Main className="main">
          <SearchResults
            isLoading={this.state.isLoading}
            results={this.state.results}
            error={this.state.error}
            onTriggerError={this.handleErrorBoundaryTrigger}
          />
        </Main>
      </>
    );
  }
}

export default App;
