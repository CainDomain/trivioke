/* eslint-disable react/prop-types */
import React from 'react';

class Lifelines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // getInitialState() {
  //   return { showResults: false };
  // }

  // onClick() {
  //   this.setState({ showResults: true });
  // }

  render() {
    const { handleClick, triviaRequest, changeCat } = this.props;
    return (
      <div>
        <h4>Lifelines</h4>
        <table style={{
          width: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}
        >
          <thead>
            <tr style={{ border: 'none' }}>
              <td><button type="button" onClick={handleClick}>50/50</button></td>
              <td><button type="button" onClick={triviaRequest}>Change Question</button></td>
              <td><button type="button" onClick={changeCat}>Change Category</button></td>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}
export default Lifelines;
