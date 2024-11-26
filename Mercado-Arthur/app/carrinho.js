import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../CartContext';

export default function CartScreen() {
  const { cart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const [modalVisible, setModalVisible] = React.useState(false); // Controle do modal para exclusão
  const [selectedItem, setSelectedItem] = React.useState(null); // Item selecionado para remoção
  const [checkoutModalVisible, setCheckoutModalVisible] = React.useState(false); // Controle do modal para finalização de compra

  const total = cart.reduce((acc, item) => acc + item.quantidade * Number(item.preco), 0);

  // Diminui a quantidade do item ou exibe o modal para confirmar exclusão
  const handleDecreaseQuantity = (id, quantidade) => {
    if (quantidade === 1) {
      setSelectedItem(id); // Define o item selecionado
      setModalVisible(true); // Exibe o modal de exclusão
    } else {
      updateQuantity(id, quantidade - 1);
    }
  };

  // Aumenta a quantidade do item
  const handleIncreaseQuantity = (id, quantidade) => {
    updateQuantity(id, quantidade + 1);
  };

  // Remove o item do carrinho
  const confirmRemoveItem = () => {
    updateQuantity(selectedItem, 0);
    setModalVisible(false); // Fecha o modal de exclusão
    setSelectedItem(null); // Reseta o item selecionado
  };

  // Cancela a exclusão do item
  const cancelRemoveItem = () => {
    setModalVisible(false); // Fecha o modal de exclusão
    setSelectedItem(null); // Reseta o item selecionado
  };

  // Abre o modal de finalização de compra
  const handleCheckout = () => {
    if (cart.length === 0) {
      setCheckoutModalVisible(false);
      return;
    }
    setCheckoutModalVisible(true); // Exibe o modal de finalização
  };

  // Finaliza a compra
  const confirmCheckout = () => {
    clearCart(); // Limpa o carrinho
    setCheckoutModalVisible(false); // Fecha o modal
    router.push('/loja'); // Redireciona para o mercado
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Carrinho</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text style={styles.itemPrice}>R$ {Number(item.preco).toFixed(2)}</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleDecreaseQuantity(item.id, item.quantidade)}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantidade}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleIncreaseQuantity(item.id, item.quantidade)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
      <Button title="Finalizar Compra" onPress={handleCheckout} />

      {/* Modal para Exclusão de Item */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={cancelRemoveItem}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja remover este item do carrinho?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelRemoveItem}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmRemoveItem}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Finalização de Compra */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={checkoutModalVisible}
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja finalizar sua compra?</Text>
            <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCheckoutModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmCheckout}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 16 },
  cartItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16, color: '#4caf50' },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
  },
});
