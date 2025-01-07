import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Header } from '@/components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ComprasAnteriores() {
  interface Produto {
    id: string;
    nome: string;
    qtd: number;
    valor: string;
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
    <View>
      <Header title="Compras Anteriores" />

      <FlatList
        style={styles.container}
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.data}>Data: {new Date(item.data).toLocaleDateString()}</Text>

            <View style={styles.tabela}>
              <View style={styles.cabecalho}>
                <Text style={styles.cabecalhoItem}>Nome</Text>
                <Text style={styles.cabecalhoItem}>Qtd</Text>
                <Text style={styles.cabecalhoItem}>Valor</Text>
              </View>

              {item.lista.map((produto) => (
                <View key={produto.id} style={styles.linha}>
                  <Text style={styles.coluna}>{produto.nome}</Text>
                  <Text style={styles.coluna}>{produto.qtd}</Text>
                  <Text style={styles.coluna}>R$ {produto.valor}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma compra anterior.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  item: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  data: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tabela: {
    marginTop: 10,
  },
  cabecalho: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  cabecalhoItem: {
    flex: 1,
    fontWeight: 'bold',
    
  },
  linha: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginLeft: 10,
  },
  coluna: {
    flex: 1,
    
  },
  vazio: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
});
