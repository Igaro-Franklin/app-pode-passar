import { Header } from '@/components/header';
import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Alert } from 'react-native';


type ItemDaCompra = {
  id: string;
  nome: string;
  qtd: string;
  valor: string;
}


export default function PodePassar() {

  const [nome, setNome] = useState<string>('');
  const [quantidade, setQuantidade] = useState<string>('1');
  const [valor, setValor] = useState<string>('');

  const [valorDisponivel, setValorDisponivel] = useState<string>('');
  const [valorDisponivelSalvo, setValorDisponivelSalvo] = useState<string>('');

  const [itens, setItens] = useState<ItemDaCompra[]>([]);
  const [alertaExibido, setAlertaExibido] = useState(false);


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
      if (dados) {
        setItens(JSON.parse(dados));
      }
    } catch (error) {
      console.log('Erro ao carregar ListaPodePassar: ', error);
    }
  };


  // Função para adicionar um item
  const addItem = () => {
    if (!nome.trim()) {
        Alert.alert('Erro', 'O nome do item não pode estar vazio.');
        return;
    }
    if (isNaN(Number(valor.replace(',', '.'))) || Number(valor.replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'O valor do item deve ser um número positivo.');
      return;
    }
    if (isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
        Alert.alert('Erro', 'A quantidade deve ser um número positivo.');
        return;
    }
    if (nome.trim()) {
      const novoItem = { id: Date.now().toString(), nome, qtd: quantidade, valor };
      const novaLista = [...itens, novoItem];
      setItens(novaLista);
      salvarItens(novaLista); // Salvar imediatamente
      setNome('');
      setQuantidade('1');
      setValor('');
    }
  };



  // Função para salvar um valor para gastar
  const salvarValorDisponivel = async (valor: string) => {
    try {
      await AsyncStorage.setItem('@ValorDisponivel', valor)
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
      console.log('Valor carregado do AsyncStorage:', valor); 
      if (valor) {
        setValorDisponivel(valor);
      }
    } catch (error) {
      console.log('Erro ao carregar o valor disponível:', error);
    }
  };

  const excluirItem = (id: string) => {
    const novaLista = itens.filter((item) => item.id !== id);
    setItens(novaLista);
    salvarItens(novaLista);
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
  const valorRestante = Number(valorDisponivelSalvo || '0') - Number(valorTotalTodosItens);
  const porcentagemRestante = (valorRestante / Number(valorDisponivelSalvo || '1')) * 100;


  // Lógica para definir a cor do valor disponível
  const definirCorTexto = () => {
    if (porcentagemRestante > 20) {
      return 'green'; 
    } else if (porcentagemRestante >= 8 && porcentagemRestante <= 20) {
      return 'orange'; 
    } else if (porcentagemRestante < 8 && porcentagemRestante >= 0) {
      return 'red';
    } else {
      return 'red';
    }
  };

  // Funções para aumentar e diminuir a quantidade
  const aumentarQtd = () => {
    const novaQtd = Math.min(999, Number(quantidade) + 1).toString();
    setQuantidade(novaQtd);
  }
  const diminuirQtd = () => {
    const novaQtd = Math.max(1, Number(quantidade) - 1).toString();
    setQuantidade(novaQtd);
  }

  // Função para criar uma nova lista e salvar a que está criada

  const salvarHistorico = async (lista: ItemDaCompra[]) => {
    try {
      const historico = await AsyncStorage.getItem('@HistoricoCompras');
      const historicoAtualizado = historico ? JSON.parse(historico) : [];
      historicoAtualizado.push({ lista, data: new Date().toISOString() });
      await AsyncStorage.setItem('@HistoricoCompras', JSON.stringify(historicoAtualizado));
    } catch (error) {
      console.log('Erro ao salvar histórico: ', error);
    }
  };
  
  const salvarListaECriarUmaNova = async () => {
    try {
      if (itens.length > 0) {
        await salvarHistorico(itens);
      }
      setItens([]); // Limpa a lista atual
      await AsyncStorage.removeItem('@ListaPodePassar'); // Remove do armazenamento
      setValorDisponivelSalvo(''); // Limpa o valor disponível
      await AsyncStorage.removeItem('@ValorDisponivel');
      Alert.alert('Nova lista', 'A lista anterior foi salva nas Compras Anteriores.');
    } catch (error) {
      console.log('Erro ao criar nova lista: ', error);
    }
  };


  useEffect(() => {
    const valorTotalTodosItens = calcularValorTotal();
    const valorRestante = Number(valorDisponivelSalvo) - valorTotalTodosItens;

    if (valorRestante < 0 && !alertaExibido){
      Alert.alert('Atenção!',  'Você ultapassou o valor dispinível!');
      setAlertaExibido(true)
    }else if (valorRestante >= 0 && alertaExibido) {
      setAlertaExibido(false);
    }
  }, [itens, setValorDisponivelSalvo]);


  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosItens = await AsyncStorage.getItem('@ListaPodePassar');
        if (dadosItens) setItens(JSON.parse(dadosItens));
  
        const valorSalvo = await AsyncStorage.getItem('@ValorDisponivel');
        if (valorSalvo) setValorDisponivelSalvo(valorSalvo);
  
        const historico = await AsyncStorage.getItem('@HistoricoCompras');
        if (historico) {
          console.log('Histórico carregado:', JSON.parse(historico));
        }
      } catch (error) {
        console.log('Erro ao carregar dados: ', error);
      }
    };
  
    carregarDados();
  }, []);


  // Carregar itens quando o componente for montado
  useEffect(() => {
    carregarItens();
  }, []);
  
  // Salvar itens sempre que a lista for alterada
  useEffect(() => {
    salvarItens(itens);
  }, [itens]);

 return (
    <View>
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
                {valorRestante.toFixed(2).replace('.', ',')}
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
            <Pressable style={styles.btnQtd} onPress={diminuirQtd}>
              <Text style={styles.textoBtnQtd}>-</Text>
            </Pressable>
            <TextInput
              placeholder='Qtd'
              style={styles.inputQtd}
              keyboardType='numeric'
              value={quantidade}
              onChangeText={(text) => setQuantidade(text)}
            />
            <Pressable style={styles.btnQtd} onPress={aumentarQtd}>
              <Text style={styles.textoBtnQtd}>+</Text>
            </Pressable>
          </View>
          <Pressable style={styles.btnSalvarItem} onPress={addItem}>
            <Feather name='check' size={30} style={{ color: colors.branco }}/>
          </Pressable>
        </View>

        

      </View>

      <View style={styles.containerLista}>
        <View style={styles.contentHeaderTabela}>
          <Text style={styles.tituloTabela}>Nome</Text>
          <Text style={styles.tituloTabela}>Qtd</Text>
          <Text style={styles.tituloTabela}>Valor Un.</Text>
          <Text style={styles.tituloTabela}>Total</Text>
          <Text style={styles.tituloTabela}>           </Text>
        </View>

        <View>
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
            ListEmptyComponent={<Text style={{ textAlign: 'center', padding: 15 }}>Nenhum item na lista.</Text>}
          />
        </View>
      </View>

      <View>
        <Pressable style={styles.btnNovaLista} onPress={salvarListaECriarUmaNova}>
          <Text style={styles.textoNovaLista}>Nova lista</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  contentHeader: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
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
    marginBottom: 5
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
    height: 40,
    borderColor: colors.azul,
    borderWidth: 1,
    borderRadius: 20,
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
    marginBottom: 10,
    gap: 10
  },

  viewQtd:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 10
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

  btnSalvarItem:{
    maxWidth: 70,
    flex: 1,
    backgroundColor: colors.azul,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },

  textoInputNome:{
    width: 'auto',
    height: 50,
    borderColor: colors.azul,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  textoInputValor:{
    width: 100,
    height: 50,
    borderColor: colors.azul,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  btnQtd:{
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgCinza,
    borderRadius: 5
  },

  containerLista:{
    padding: 2,
  },

  flatList:{
    maxHeight: 330,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    marginBottom: 10,
    backgroundColor: colors.cinzaClaro
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
  },

  btnNovaLista:{
    margin: 'auto',
    backgroundColor: colors.vermelho,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  textoNovaLista:{
    color: colors.branco,
    paddingHorizontal: 50,
    paddingVertical: 15
  }
})