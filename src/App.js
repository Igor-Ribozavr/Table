import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchEmail, setSearchEmail] = useState('');
  const [activity, setActivitySearch] = useState('All');
  const [balMin, setBalMin] = useState('');
  const [balMax, setBalMax] = useState('');
  const [details, setDetails] = useState([]);
  const [data, setData] = useState();

  const toggleShawn = (userId) => {
    const shownState = details.slice();
    const index = shownState.indexOf(userId);

    if (index >= 0) {
      shownState.splice(index, 1);
      setDetails(shownState);
    } else {
      shownState.push(userId);
      setDetails(shownState);
    }
  };
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:4000');
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="container-filters">
        <div className="container-filters-inner">
          <h1 className="header">Фильтры</h1>
          <div className="filter-balance">
            <div className="text">Поиск по балансу от</div>
            <input
              className="input-balance-from"
              onChange={(event) => {
                setBalMin(event.target.value);
              }}
            ></input>
            <small>до</small>
            <input
              className="input-balance-to"
              onChange={(event) => {
                setBalMax(event.target.value);
              }}
            ></input>
          </div>
          <div className="filter-email">
            <div className="text">Найти по email </div>
            <input
              className="input-email"
              type="email"
              onChange={(event) => {
                setSearchEmail(event.target.value);
              }}
            ></input>
          </div>
          <div className="filter-activity">
            <div className="text">Поиск по активности</div>
            <select
              className="input-activity"
              onChange={(event) => setActivitySearch(event.target.value)}
            >
              <option value="All">Все</option>
              <option value="true">Aктивен</option>
              <option value="false">Не активен</option>
            </select>
          </div>
        </div>
      </div>
      <div className="container-table">
        <table className="main-table">
          <tbody>
            <tr>
              <th className="th-head">Имя</th>
              <th className="th-head">Баланс</th>
            </tr>
            {!data && (
              <tr>
                <td className="td-table">The server</td>
                <td className="td-table">hasn't a connection</td>
              </tr>
            )}
            {data &&
              data
                .filter((elem) => {
                  if (balMin === '') {
                    return elem;
                  } else if (
                    balMin <
                    parseFloat(
                      elem.balance.match(/\d+/g)[0] +
                        elem.balance.match(/\d+/g)[1] +
                        '.' +
                        elem.balance.match(/\d+/g)[2]
                    )
                  ) {
                    return elem;
                  }
                })
                .filter((elem) => {
                  if (balMax === '') {
                    return elem;
                  } else if (
                    balMax >
                    parseFloat(
                      elem.balance.match(/\d+/g)[0] +
                        elem.balance.match(/\d+/g)[1] +
                        '.' +
                        elem.balance.match(/\d+/g)[2]
                    )
                  ) {
                    return elem;
                  }
                })
                .filter((elem) => {
                  if (searchEmail === '') {
                    return elem;
                  } else if (
                    elem.email
                      .toLocaleLowerCase()
                      .includes(searchEmail.toLowerCase())
                  ) {
                    return elem;
                  }
                })
                .filter((elem) => {
                  if (activity === 'All') {
                    return elem;
                  } else if (activity === 'true') {
                    return elem.isActive === true;
                  } else if (activity === 'false') {
                    return elem.isActive === false;
                  }
                })
                .map((el) => (
                  <React.Fragment key={el.id.toString()}>
                    <tr
                      className="row-main-information"
                      onClick={() => toggleShawn(el.id)}
                    >
                      <td className="td-table-main">{el.name}</td>
                      <td className="td-table-main">{el.balance}</td>
                    </tr>
                    {details.includes(el.id) && (
                      <>
                        <tr
                          className={'row-additional-information'}
                          onClick={() => toggleShawn(el.id)}
                        >
                          <td className="td-table-additional">Активность</td>
                          <td className="td-table-additional">
                            {el.isActive ? 'Активен' : 'Не активен'}
                          </td>
                        </tr>
                        <tr
                          className={'row-additional-information'}
                          onClick={() => toggleShawn(el.id)}
                        >
                          <td className="td-table-additional">Email</td>
                          <td className="td-table-additional">{el.email}</td>
                        </tr>
                      </>
                    )}
                  </React.Fragment>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
