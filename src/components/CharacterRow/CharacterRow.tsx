import React from 'react';
import { Character } from '../../types/types';

interface CharacherRowProps extends React.HTMLAttributes<HTMLElement> {
  item: Character;
}

const CharacherRow: React.FC<CharacherRowProps> = ({ item, ...rest }) => {
  return (
    <tr {...rest}>
      <td>
        <strong>Name</strong> : {item.name}
        <br />
        <strong>Gender</strong> : {item.gender}
        <br />
        <strong>Hair</strong> : {item.hair_color}
        <br />
        <strong>Skin Color</strong> : {item.skin_color}
        <br />
        <strong>Eye color</strong> : {item.eye_color}
        <br />
        <strong>Gender</strong> : {item.gender}
        <br />
        <strong>Height</strong> : {item.height}
        <br />
        <strong>Mass</strong> : {item.mass}
        <br />
        <strong>BirthYear</strong> : {item.birth_year}
        <br />
      </td>
    </tr>
  );
};

export default CharacherRow;
