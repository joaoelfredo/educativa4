import React from 'react';
import { Image, StyleSheet } from 'react-native';
import mascotImage from '../../assets/mascote.png';

const Mascot = ({ width = 128, height = 128 }) => {
  const imageStyle = {
    width: width,
    height: height,
  };

  return (
    <Image
      source={mascotImage}
      style={[styles.image, imageStyle]}
      resizeMode="contain" // Garante que a imagem caiba sem distorcer
    />
  );
};

const styles = StyleSheet.create({
  image: {
    // Você pode adicionar outros estilos padrão aqui se precisar,
    // como uma borda, sombra, etc.
  },
});


export default Mascot;