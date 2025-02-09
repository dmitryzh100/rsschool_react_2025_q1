import React, { FormEvent, ChangeEvent, useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';

interface SearchFormProps {
  searchTerm: string;
  isLoading: boolean;
  onSearch: (value: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  isLoading,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState<string>(searchTerm || '');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <>
      <h1>STAR WARS Characters Info Finder</h1>
      <h2>Search form</h2>
      <Form className="form" onSubmit={handleSubmit}>
        <Input
          placeholder="Enter character name"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button type="submit" disabled={isLoading}>
          Search
        </Button>
      </Form>
    </>
  );
};

export default SearchForm;
