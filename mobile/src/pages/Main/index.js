import React, {Component} from 'react';
import {Keyboard, ActivityIndicator, View} from 'react-native';
import PropTypes from 'prop-types';
import {StyleSheet, PanResponder, Animated} from 'react-native';

import Swipeout from 'react-native-swipeout';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

import api from '../../services/api';
export default class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
    view: new Animated.ValueXY({x: 0, y: 0}),
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');
    if (users) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({users: JSON.parse(users)});
    }
  }
  componentDidUpdate(_, prevState) {
    const {users} = this.state;
    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleSubmit = async () => {
    const {users, newUser} = this.state;
    this.setState({loading: true});
    const response = await api.get(`/users/${newUser}`);
    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.setState({
      users: [...users, data],
      newUser: '',
      loading: false,
    });

    Keyboard.dismiss();
  };

  handleNavigation = user => {
    const {navigation} = this.props;
    navigation.navigate('User', {user});
  };

  render() {
    const {users, newUser, loading} = this.state;
    return (
      <>
        <Container>
          <Form>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="adicionar usuário"
              value={newUser}
              onChangeText={text => this.setState({newUser: text})}
              returnKeyType="send"
              onSubmitEditing={this.handleSubmit}
            />
            <SubmitButton loading={loading} onPress={this.handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Icon name="add" size={20} color="#FFF" />
              )}
            </SubmitButton>
          </Form>
          <List
            data={users}
            keyExtractor={user => user.login}
            renderItem={({item}) => (
              <View style={[styles.User]}>
                <Avatar source={{uri: item.avatar}} />
                <Name>{item.name}</Name>
                <Bio>{item.bio}</Bio>

                <ProfileButton onPress={() => this.handleNavigation(item)}>
                  <ProfileButtonText>Ver Perfil</ProfileButtonText>
                </ProfileButton>
              </View>
            )}
          />
        </Container>
      </>
    );
  }
}
const styles = StyleSheet.create({
  User: {
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 25,
    marginRight: 25,
  },

  ball: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f00',
  },
});
