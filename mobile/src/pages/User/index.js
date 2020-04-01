import React, {Component} from 'react';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  ShimmerAvatar,
  ShimmerTitle,
  ShimmerAuthor,
} from './styles';

export default class User extends Component {
  state = {
    stars: [],
    visible: false,
    shimmer: ['1', '2', '3'],
  };
  setTitle() {
    const {navigation} = this.props;
    const {user} = this.props.route.params;
    navigation.setOptions({
      title: user.name,
    });
  }
  async componentDidMount() {
    console.disableYellowBox = true;

    this.setTitle();
    const {user} = this.props.route.params;
    const response = await api.get(`/users/${user.login}/starred`);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      stars: response.data,
      visible: true,
    });
  }

  render() {
    const {user} = this.props.route.params;
    const {stars, visible, shimmer} = this.state;
    return (
      <Container>
        <Header />
        <Avatar source={{uri: user.avatar}} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
        {visible ? (
          <Stars
            data={stars}
            keyExtactor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        ) : (
          <Stars
            data={shimmer}
            keyExtactor={shimmer}
            renderItem={() => (
              <Starred>
                <ShimmerAvatar autoRun={true} />
                <Info>
                  <ShimmerTitle autoRun={true} />
                  <ShimmerAuthor autoRun={true} />
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
