import React from 'react';
import { type Character } from '../../types/types';

interface itemacterRowProps {
  item: Character;
}

class itemacterRow extends React.Component<itemacterRowProps> {
  render() {
    const { item } = this.props;
    return (
      <tr>
        <td>{item.name}</td>
        <td>
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
  }
}

export default itemacterRow;
