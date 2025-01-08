import { Text, View, Pressable, StyleSheet, Image } from "react-native";
import { colors } from '../constants/colors';
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>

      <View style={styles.headerInicio}>
        <Image
          source={require('../assets/images/imageCompras.png')}
          style={styles.imagem}
        />
        <Text style={styles.titulo}>Pode Passar!</Text>
      </View>

      <View style={styles.divBotoes}>
        <View style={styles.containerDosBotoes}>
          <Link href={"/minhaLista"} asChild>
            <Pressable style={styles.botao}>
              <Image
                source={require('../assets/images/listaCompras.png')}
                style={styles.imagemBtn}
              />
              <Text style={styles.botaoText}>Minha Lista</Text>
            </Pressable>
          </Link>

          <Link href={"/podePassar"} asChild>
            <Pressable style={styles.botao}>
              <Image
                source={require('../assets/images/carrinhoPP.png')}
                style={styles.imagemBtn}
              />
              <Text style={styles.botaoText}>PodePassar</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.containerDosBotoes}>
          <Link href={"/promocao"} asChild>
            <Pressable style={styles.botao}>
            <Image
                source={require('../assets/images/promocao.png')}
                style={styles.imagemBtn}
              />
              <Text style={styles.botaoText}>Promoções</Text>
            </Pressable>
          </Link>

          <Link href={"/comprasAnteriores"} asChild>
            <Pressable style={styles.botao}>
              <Image
                  source={require('../assets/images/comprasAnteriores.png')}
                  style={styles.imagemBtn}
                />
              <Text style={styles.botaoText}>Compras Anteriores</Text>
            </Pressable>
          </Link>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
  },
  
  headerInicio:{
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  imagem:{
    width: 150,
    height: 150,
  },

  titulo:{
    fontSize: 55,
    fontWeight: 'bold',
    color: colors.preto,
    fontFamily: 'Cochin',
    textShadowColor: 'rgba(15, 15, 15, 0.56)',
    textShadowRadius: 3,
    textShadowOffset: {width: 3, height: 3}
  },

  divBotoes:{
    width: '100%',
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 10,
  },

  containerDosBotoes:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },

  botao:{
    flex: 1,
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    boxShadow: '3px 3px 10px rgba(0,0,0,0.75)',
    margin: 5,
    flexDirection: 'column',

  },

  botaoText:{
    fontSize: 20
  },

  imagemBtn:{
    width: 80,
    height: 80
  }

})
