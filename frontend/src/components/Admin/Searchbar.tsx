import React, { Component } from 'react';
import './AdminUserList.css';
import { IonSearchbar } from '@ionic/react';

type SearchProps = {
  data: Array<any> | null;
  handleSetData: Function;
};

export default class SearchBar extends Component<
  SearchProps,
  { searchInput: string }
  > {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
    };
  }

  handleChange = (event) => {
    this.setState({ searchInput: event.target.value }, () =>
      this.globalSearch(),
    );
  };

  globalSearch = () => {
    let filteredData: any = '';
    let { searchInput } = this.state;
    filteredData = this.props.data?.filter((value) => {
      if (!value.email || !value.number || !value.name) {
        return;
      }
      return (
        value.email
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        value.number
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        value.name.toString().toLowerCase().includes(searchInput.toLowerCase())
      );
    });

    this.props.handleSetData(
      (filteredData.length > 0 && filteredData) || searchInput
        ? filteredData
        : this.props.data,
    );
  };

  render() {
    return (
      <>
        <IonSearchbar
          className="search-bar"
          value={this.state.searchInput}
          onIonChange={this.handleChange.bind(this)}
          animated
          placeholder="Buscar"
        ></IonSearchbar>
      </>
    );
  }
}
