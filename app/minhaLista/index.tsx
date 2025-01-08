import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native';
import { Header } from '@/components/header';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';

type Task = {
  id: string;
  title: string;
  qtd: number;
  comprado: boolean;
};

export default function MinhaLista() {
  const [item, setItem] = useState<string>('');
  const [qtd, setQtd] = useState<number>(1);
  const [itens, setItens] = useState<Task[]>([]);

  // Função para salvar itens no AsyncStorage
  const salvarItens = async (itens: Task[]) => {
    try {
      await AsyncStorage.setItem('@itens', JSON.stringify(itens));
    } catch (error) {
      console.error('Erro ao salvar itens no AsyncStorage:', error);
    }
  };

  // Função para carregar itens do AsyncStorage
  const carregarItens = async () => {
    try {
      const dados = await AsyncStorage.getItem('@itens');
      if (dados) {
        setItens(JSON.parse(dados));
      }
    } catch (error) {
      console.error('Erro ao carregar itens do AsyncStorage:', error);
    }
  };

  // Carregar itens quando o componente for montado
  useEffect(() => {
    carregarItens();
  }, []);

  // Salvar itens sempre que a lista for alterada
  useEffect(() => {
    salvarItens(itens);
  }, [itens]);

  // Adicionar um item
  const adicionarItem = () => {
    if (item.trim()) {
      const novoItem = { id: Date.now().toString(), title: item, qtd: qtd, comprado: false };
      setItens([...itens, novoItem]);
      setItem('');
    }
  };

  // Remover um item
  const excluirItem = (id: string) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  // Alternar o estado "comprado" de um item
  const itemComprado = (id: string) => {
    setItens(
      itens.map((item) =>
        item.id === id ? { ...item, comprado: !item.comprado } : item
      )
    );
  };

  // Apagar todos os itens

  const novaLista = () => {
    Alert.alert("Nova Lista", "Tem certeza? Isso apagará todos os itens atuais!",
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: async () =>{
          setItens([]);
          await salvarItens([]);
        }
      }
    ])
  }

  // Funções para aumentar e diminuir a quantidade
  const aumentarQtd = () => {
    const novaQtd = Math.min(999, Number(qtd) + 1).toString();
    setQtd(Number(novaQtd));
  }
  const diminuirQtd = () => {
    const novaQtd = Math.max(1, Number(qtd) - 1).toString();
    setQtd(Number(novaQtd));
  }

  return (
    <View style={styles.tela}>
      <View>
        <Header title="Lista de compras" />
      </View>
      <View style={styles.container}>

        <Pressable onPress={novaLista} style={styles.btnNovaLista}>
          <Text style={styles.textoNovaLista}>Criar nova lista</Text>
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Digite um item"
          value={item}
          onChangeText={setItem}
        />
        <View style={styles.viewQtd}>
          <Pressable style={styles.btnQtd} onPress={diminuirQtd}>
            <Text style={styles.textoBtnQtd}>-</Text>
          </Pressable>
          <TextInput
            placeholder='Qtd'
            style={styles.inputQtd}
            keyboardType='numeric'
            value={qtd.toString()}
            onChangeText={(text) => setQtd(Number(text))}
          />
          <Pressable style={styles.btnQtd} onPress={aumentarQtd}>
            <Text style={styles.textoBtnQtd}>+</Text>
          </Pressable>
        </View>

        <Button title="Adicionar item" onPress={adicionarItem} />

        <FlatList
          style={styles.flatList}
          data={itens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => itemComprado(item.id)} style={[styles.itemDaLista, item.comprado && styles.itemBackgroundComprado]}>
              <Text
                style={[
                  styles.itemTexto,
                  item.comprado && styles.itemComprado,
                ]}
              >
                {item.title}
              </Text>
              <Text>{item.qtd} un. </Text>
              <TouchableOpacity onPress={() => excluirItem(item.id)} style={styles.excluirButton}>
                <Text style={styles.excluirTexto}>
                  <Feather name='trash-2' size={20} />
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.azul,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 5,
  },

  flatList: {
    marginTop: 15,
    marginBottom: 10,
  },

  itemDaLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.branco,
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  itemTexto: {
    fontSize: 16,
    color: colors.preto,
  },
  
  itemComprado: {
    textDecorationLine: 'line-through',
    color: colors.preto,
    opacity: 0.5,
  },

  itemBackgroundComprado: {
    backgroundColor: colors.bgVerde,
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },

  excluirButton: {
    backgroundColor: colors.vermelho,
    padding: 8,
    borderRadius: 5,
  },

  excluirTexto: {
    color: colors.branco,
    fontWeight: 'bold',
  },

  btnNovaLista:{
    backgroundColor: colors.vermelho,
    width: 150,
    height: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    alignSelf: 'flex-end',
  },

  textoNovaLista:{
    color: colors.branco,
    fontWeight: 'bold'
  },

  viewQtd:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
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

  btnQtd:{
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgCinza,
    borderRadius: 5
  },

});
