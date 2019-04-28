import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions, StyleSheet, View } from 'react-native';
import { arrayOfComics, setIndex } from './src/dataStore';
import Carousel from 'react-native-snap-carousel';
import { ComicView } from './src/ComicView';


type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();
    this.state = {
      data: arrayOfComics
    };
  }

  componentDidMount() {
    this.eventListener = DeviceEventEmitter.addListener('refresh', (data) => {
      this.setState({
        data
      });
    });
  }

  _renderItem({ item, index }) {
    return (
      <ComicView {...item} />
    );
  }

  render() {
    const { data } = this.state;

    return (
      <View style={styles.container}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={data}
          renderItem={this._renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width - 75}
          layout="default"
          onSnapToItem={setIndex}

          removeClippedSubviews={true}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d7da',
    flex: 1,
  },
});
