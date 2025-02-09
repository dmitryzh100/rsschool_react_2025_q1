// src/components/CharacterDetail/CharacterDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Spinner from '../Spinner/Spinner';
import SWAPIService from '../../service/SWAPIService';
import { Character } from '../../types/types';

const CharacterDetail: React.FC = () => {
  // Get the characterId (and page if needed) from the route parameters.
  const { characterId, page } = useParams<{
    characterId: string;
    page: string;
  }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const service = new SWAPIService();
    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);

      if (!characterId) {
        setError('No characterId has been found');
        setIsLoading(false);
      } else {
        const response = await service.getCharacterDetails(characterId);

        if ('error' in response) {
          setError(response.errorInfo);
        } else {
          setCharacter(response);
        }
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [characterId]);

  const handleClose = () => {
    // Navigate back to the parent route (e.g. /search/2).
    navigate(`/search/${page}`);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  if (!character) return null;

  return (
    <div className="character-detail">
      <button onClick={handleClose}>Close</button>
      <h3>{character.name}</h3>
      <p>Gender: {character.gender}</p>
      <p>Hair Color: {character.hair_color}</p>
      {/* Add additional character details as needed */}
    </div>
  );
};

export default CharacterDetail;
