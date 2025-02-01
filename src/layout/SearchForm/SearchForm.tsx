import React, { FormEvent, ChangeEvent } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';

interface SearchFormProps {
  searchTerm: string;
  isLoading: boolean;
  onSearch: (value: string) => void;
}

interface SearchFormState {
  inputValue: string;
}

class SearchForm extends React.Component<SearchFormProps, SearchFormState> {
  constructor(props: SearchFormProps) {
    super(props);
    this.state = {
      inputValue: props.searchTerm || '',
    };
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value.trim() });
  };

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { onSearch } = this.props;
    const { inputValue } = this.state;
    onSearch(inputValue);
  };

  render() {
    return (
      <>
        <h1>STAR WARS Characters Info Finder </h1>
        <h2>Search form</h2>
        {/* //TODO: Add styling for form and it's elements */}
        <Form
          onSubmit={this.handleSubmit}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Input
            placeholder="Enter character name"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <Button type="submit" disabled={this.props.isLoading}>
            Search
          </Button>
        </Form>
      </>
    );
  }
}

export default SearchForm;
