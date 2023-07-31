import {StyleSheet} from 'react-native'
const colors = {
    primary: '#09F',
    background:'#FFF',
    background2:'#DFD',
    card: '#AFC',
    dark: '#092',
    text: '#000',
    border: '#000',
    greyOutline:'#CCC',
    searchBg:'#EFE',
    success:"#3F3",
    error:"#FC0",
    warning:"#F00",
}
const theme = {// react native elements themes
    Button:{

    },
    Overlay:{
        overlayStyle:{margin:10,padding:10}
    },
    Card:{
        containerStyle:{backgroundColor:colors.card,borderRadius:10}
    },
    Divider:{
        style:{margin:5}
    },
    colors: colors
}


const gstyles = StyleSheet.create({
    screenScrollView:{
        backgroundColor:theme.colors.background,
    },
    screen:{
        padding:10,
        paddingBottom:30,
        flex:1,
    },
    centeredModalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        marginBottom:5,
      },
})

export {theme,gstyles}