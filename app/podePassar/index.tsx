import { Header } from '@/components/header';
import { colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Button, FlatList } from 'react-native';


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

  const [valorDisponivel, setValorDisponivel] = useState<string>('');
  const [valorDisponivelSalvo, setValorDisponivelSalvo] = useState<string>('');

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

  // Função para salvar um valor para gastar
  const salvarValorDisponivel = async (valor: string) => {
    try {
      await AsyncStorage.setItem('@ValorDisponivel', (valor))
      setValorDisponivelSalvo(valor);
    } catch (error) {
      console.log('Erro ao salvar o valor disponível: ', error)
    }
  }

  // Função para carregar um valor para gastar
  const carregarValorDisponivel = async () => {
    try {
      const valor = await AsyncStorage.getItem('@ValorDisponivel');
      if (valor) {
        setValorDisponivel(valor);
      }
    } catch (error) {
      console.log('Erro ao carregar o valor disponível:', error);
    }
  };

  useEffect(() => {
    const carregarValorDisponivel = async () => {
      try {
        const valorSalvo = await AsyncStorage.getItem('@valorDisponivel');
        if (valorSalvo) {
          setValorDisponivelSalvo(valorSalvo);
        }
      } catch (error) {
        console.log('Erro ao carregar valor disponível:', error);
      }
    };
  
    carregarValorDisponivel();
  }, []);

 return (
    <View>
        <View>
          <Header title='Pode Passar!' />
        </View>

        <View style={styles.contentHeader}>

            <View>
              <View style={styles.contentValorGastar}>
                <TextInput
                  placeholder='R$ a ser gasto'
                  style={styles.textoValorDisponivel}
                  keyboardType='numeric'
                  value={valorDisponivel}
                  onChangeText={setValorDisponivel}
                />
                <Pressable style={styles.btnSalvarValorGastar}>
                  <Text 
                    style={styles.textoSalvarValorGastar}
                    onPress={() => salvarValorDisponivel(valorDisponivel)}
                  >
                    Salvar
                  </Text>
                </Pressable>
              </View>
              <Text>Valor disponível: R$ {valorDisponivelSalvo}</Text>
            </View>

          <TextInput
            placeholder='Nome do item'
            style={styles.textoInputNome}
            value={nome}
            onChangeText={(text) => setNome(text)}
          />
          <View style={styles.contentQdt}>
            <TextInput
              placeholder='Valor un.'
              style={styles.textoInputValor}
              keyboardType='numeric'
              value={valor}
              onChangeText={(text) => setValor(text)}
            />
            <View style={styles.viewQtd}>
              <Pressable style={styles.btnQtd}>
                <Text style={styles.textoBtnQtd}>-</Text>
              </Pressable>
              <TextInput
                placeholder='Qtd'
                style={styles.inputQtd}
                value={quantidade}
                onChangeText={(text) => setQuantidade(text)}
              />
              <Pressable style={styles.btnQtd}>
                <Text style={styles.textoBtnQtd}>+</Text>
              </Pressable>
            </View>
          </View>

          <Button title='Salvar' onPress={addItem}/>

        </View>

        <FlatList
          data={itens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text> {item.nome} - {item.qtd} - {item.valor} </Text>
          )}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  contentHeader: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10
  },

  contentValorGastar:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.bgCinza,
    marginBottom: 10,
  },

  textoValorDisponivel:{
    width: 180,
    height: 60,
    borderColor: colors.azul,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontSize: 20
  },

  textoSalvarValorGastar:{
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.branco
  },

  btnSalvarValorGastar:{
    width: 100,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: colors.azul
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
    height: 50,
    borderColor: colors.azul,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10
  },

  textoBtnQtd:{
    fontSize: 30,
    fontWeight: 'bold'
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