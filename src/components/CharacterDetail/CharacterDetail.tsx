import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Spinner from '../Spinner/Spinner';
import SWAPIService from '../../service/SWAPIService';
import { Character } from '../../types/types';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import CharacterRow from '../CharacterRow/CharacterRow';

import './style.scss';

const CharacterDetail: React.FC = () => {
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
    navigate(`/search/${page}`);
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMsg error={error} />;
  if (!character) return null;

  return (
    <>
      <h2>Character Description</h2>
      <div className="character-details-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Character Description</th>
            </tr>
          </thead>
          <tbody>
            <CharacterRow item={character} />
          </tbody>
        </table>
        <button className="close-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default CharacterDetail;
