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
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
  },
  
  headerInicio:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.preto
  },

  imagem:{
    width: 150,
    height: 150,
  },

  titulo:{
    fontSize: 35,
    fontWeight: 'bold',
    color: colors.branco,
    fontFamily: 'Cochin',
  },

  divBotoes:{
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },

  botao:{
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: colors.branco,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    flexDirection: 'row'
  },

  botaoText:{
    fontSize: 30
  },

  imagemBtn:{
    width: 80,
    height: 80
  }

})
