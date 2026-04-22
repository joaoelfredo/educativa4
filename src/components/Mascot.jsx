import React from 'react';
import { Image, StyleSheet } from 'react-native';
import mascotImage from '../../assets/mascote.png';

const Mascot = ({ width = 128, height = 128, source }) => {
  const imageStyle = {
    width: width,
    height: height,
    borderRadius: source ? width / 2 : 0, // Arredonda se for foto customizada
  };

  return (
    <Image
      source={source || mascotImage}
      style={[styles.image, imageStyle]}
      resizeMode={source ? "cover" : "contain"} 
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