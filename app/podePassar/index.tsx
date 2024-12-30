import { Header } from '@/components/header';
import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Button, FlatList, Alert } from 'react-native';


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

    setValorDisponivel('');
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
    carregarValorDisponivel();
  }, []);

  const excluirItem = (id: string) => {
    setItens(itens.filter((item) => item.id !== id));
  };


  // Função para calcular o valor total dos itens
  const calcularValorTotal = () => {
    return itens.reduce((soma, item) => {
      const quantidade = Number(item.qtd.replace(',', '.'));
      const valor = Number(item.valor.replace(',', '.'));
      return soma + quantidade * valor;
    }, 0);
  };

  const valorTotalTodosItens = calcularValorTotal().toFixed(2);
  const valorRestante = Number(valorDisponivel) - Number(valorTotalTodosItens);
  const porcentagemRestante = (valorRestante / Number(valorDisponivel)) * 100;

  // Lógica para definir a cor
  const definirCorTexto = () => {
    if (porcentagemRestante > 20) {
      return 'green'; 
    } else if (porcentagemRestante >= 8 && porcentagemRestante <= 20) {
      return 'orange'; 
    } else if (porcentagemRestante < 8 && porcentagemRestante >= 0) {
      return 'red';
    } else {
      // Caso o valor restante seja negativo (ultrapassou o valor disponível)
      Alert.alert('Atenção!', 'Você ultrapassou o valor disponível.');
      return 'red';
    }
  };

 return (
    <View style={{flex: 1 }}>
        <View>
          <Header title='Pode Passar!' />
        </View>

        <View style={styles.contentHeader}>

            <View style={styles.conteinerValorGastar}>
              <View style={styles.contentValorGastar}>
                <TextInput
                  placeholder='R$ a ser gasto'
                  style={styles.inputValorDisponivel}
                  keyboardType='numeric'
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
              <Text style={styles.textoValorDisponivel}>Valor disponível: R$ 
                <Text style={[styles.valorVariavel, { color: definirCorTexto() }]}>
                  {valorRestante.toFixed(2).replace('.', ',')} {/* Formatação brasileira */}
                </Text>
              </Text>
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
                keyboardType='numeric'
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

        <View>
          <View style={styles.contentHeaderTabela}>
            <Text style={styles.tituloTabela}>Nome</Text>
            <Text style={styles.tituloTabela}>Qtd</Text>
            <Text style={styles.tituloTabela}>Valor Un.</Text>
            <Text style={styles.tituloTabela}>Total</Text>
            <Text style={styles.tituloTabela}>Ação</Text>
          </View>

          <View style={{ flex: 1 }}>
            <FlatList
              style={styles.flatList}
              data={itens}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const quantidade = Number(item.qtd.replace(',', '.'));
                const valor = Number(item.valor.replace(',', '.'));
                const total = (quantidade * valor).toFixed(2);

                return (
                  <View style={styles.corpoTabela}>
                    <Text style={styles.textoTabela}>{item.nome}</Text>
                    <Text style={styles.textoTabela}>{item.qtd}</Text>
                    <Text style={styles.textoTabela}>{item.valor}</Text>
                    <Text style={styles.textoTabela}>R$ {total.replace('.', ',')}</Text>
                    <Text style={styles.excluiritem} onPress={() => excluirItem(item.id)}>
                      <Feather name="trash-2" size={30} />
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>

        <View>
          <Text>Btn para nova lista</Text>
          <Text>Btn para nova lista</Text>
          <Text>Btn para nova lista</Text>
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

  conteinerValorGastar:{
    borderBottomWidth: 1,
    borderBottomColor: colors.bgCinza,
    marginBottom: 10,
  },

  contentValorGastar:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textoValorDisponivel:{
    fontSize: 18
  },

  valorVariavel:{
    color: colors.bgVerde,
    paddingLeft: 10,
  },

  inputValorDisponivel:{
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
  },

  flatList:{
    marginHorizontal: 2,
    marginBottom: 10,
  },

  contentHeaderTabela:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10, 
    backgroundColor: colors.bgCinza
  },

  tituloTabela:{
    fontWeight: 'bold'
  },

  excluiritem: {
    color: colors.vermelho,
    fontWeight: 'bold',
  },

  textoTabela:{
    flex: 1,
    paddingBottom: 5,
  },

  corpoTabela:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: colors.azul
  }
})