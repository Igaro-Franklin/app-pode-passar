import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ComprasAnteriores() {
  interface Produto {
    id: string;
    nome: string;
    qtd: number;
    valor: number;
  }

  interface Compra {
    data: string;
    lista: Produto[];
  }

  const [historico, setHistorico] = useState<Compra[]>([]);

  const carregarHistorico = async () => {
    try {
      const dados = await AsyncStorage.getItem('@HistoricoCompras');
      if (dados) {
        setHistorico(JSON.parse(dados));
      }
    } catch (error) {
      console.log('Erro ao carregar histórico: ', error);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Compras Anteriores</Text>
      <FlatList
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.data}>Data: {new Date(item.data).toLocaleDateString()}</Text>
            {item.lista.map((produto) => (
              <View key={produto.id} style={styles.produto}>
                <Text>Nome: {produto.nome}</Text>
                <Text>Qtd: {produto.qtd}</Text>
                <Text>Valor: {produto.valor}</Text>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma compra anterior.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  data: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  produto: {
    marginBottom: 5,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});