import React, { PureComponent } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { WebView } from 'react-native-webview';

export class ComicView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            comicToShow: 0,
        }

        this.toggleComic.bind(this);
    }

    toggleComic = () => {
        this.setState({
            comicToShow: (this.state.comicToShow + 1) % 2,
        });
    }

    render() {
        const { src, title, afterComic } = this.props;
        const { comicToShow } = this.state;

        const contents = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        * { transition: all 500ms ease; }
                        body {
                            background-image:
                                radial-gradient(
                                  circle,
                                  #ddd,
                                  #eee
                                );
                            background-size: cover;
                        }
                        .comic { width: 100%; }
                        .visible { display: block; }
                        .not-visible { display: none; }
                    </style>
                </head>
                <body>
                    <img src="${src}" class="comic ${comicToShow && 'not-visible'}" />
                    <img src="${afterComic}" class="comic ${!comicToShow && 'not-visible'}"/>
                    <h6>${title}</h6>
                </body>
            </html>
        `;

        return (
            <View style={styles.container}>
                <View style={styles.webViewContainer}>
                    <WebView
                        source={{ html: contents }}
                        scalesPageToFit={true}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={this.toggleComic}
                        title={comicToShow ? "Regular Comic" : "After Comic"}
                        color="red"
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    webViewContainer: {
        flex: 1,
    },
    buttonContainer: {
        borderRadius: 100,
        backgroundColor: 'red',
        width: '50%',
        overflow: 'hidden',
        marginLeft: '25%'
    }
});
