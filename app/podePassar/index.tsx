import { Header } from '@/components/header';
import { colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Button } from 'react-native';


type ItemDaCompra = {
  id: string;
  nome: string;
  qtd: string;
  valor: string;
}

export default function PodePassar() {

  const [nome, setNome] = useState<string>('');
  const [quantidade, setQuantidade] = useState<string>('');
  const [valor, setValor] = useState<string>('');

  const [itens, setItens] = useState<ItemDaCompra[]>([]);


  // Função para salvar os itens adicionados
  const salvarItens = async (itens: ItemDaCompra[]) =>{
    try {
      await AsyncStorage.setItem('@ListaPodePassar', JSON.stringify(itens));
    } catch (error) {
      console.log('Erro ao salvar ListaPodePassar: ', error);
    }
  }

  // Função para carregar os itens adicionados
  const carregarItens = async () => {
    try {
      const dados = await AsyncStorage.getItem('@ListaPodePassar');
      if(dados){
        setItens(JSON.parse(dados))
      }
    } catch (error) {
      console.log('Erro ao carregar ListaPodePassar: ', error);
    }
  }

  // Carregar itens quando o componente for montado
  useEffect(() => {
    carregarItens();
  }, []);
  
  // Salvar itens sempre que a lista for alterada
  useEffect(() => {
    salvarItens(itens);
  }, [itens]);

  //

  // Função para adicionar um item
  const addItem = () =>{
    if(nome.trim()){
      const novoItem = {id: Date.now().toString(), nome: nome, qtd: quantidade, valor: valor};
      setItens([...itens, novoItem]);
      setNome('');
      setQuantidade('');
      setValor('');
    }
  }

 return (
    <View>
        <View>
          <Header title='Pode Passar!' />
        </View>

        <View style={styles.contentHeader}>
          <TextInput
            placeholder='Nome do item'
            style={styles.textoInputNome}
          />
          <View style={styles.contentQdt}>
            <TextInput
              placeholder='Valor un.'
              style={styles.textoInputValor}
            />
            <View style={styles.viewQtd}>
              <Pressable style={styles.btnQtd}>
                <Text>-</Text>
              </Pressable>
              <TextInput
                placeholder='Qtd'
                style={styles.inputQtd}
              />
              <Pressable style={styles.btnQtd}>
                <Text>+</Text>
              </Pressable>
            </View>
          </View>

          <Button title='Salvar' />

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentHeader: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10
  },

  contentQdt:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10
  },

  viewQtd:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8
  },

  inputQtd:{
    width: 60,
    borderColor: colors.azul,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10
  },

  textoInputNome:{
    width: 'auto',
    height: 60,
    borderColor: colors.azul,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  textoInputValor:{
    width: 100,
    height: 60,
    borderColor: colors.azul,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  btnQtd:{
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgCinza,
    borderRadius: 5
  }
})