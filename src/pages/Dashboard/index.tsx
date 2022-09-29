import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food, { FoodItemProps } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodData {
  id: number;
  image: string;
  name: string;
  price: string;
  description: string;
  available: boolean;
}

interface FormData {
  image: string;
  name: string;
  price: string;
  description: string;
}


function Dashboard(){
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [editingFood, setEditingFood] = useState<FoodItemProps>({} as FoodItemProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  useEffect(() => {
    (async () => {
      const response = await api.get('/foods');
      setFoods(response.data);
    })()
  }, []);

  async function handleAddFood(food: FoodItemProps){
    
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
    setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FormData){

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      
      setFoods(foodsUpdated);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number){

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered)
  }

  async function toggleModal() {
    setModalOpen(prev => !prev);
  }

  async function toggleEditModal(){
    setEditModalOpen(prev => !prev);
  }

  async function handleEditFood(food: FoodItemProps){
    setEditModalOpen(true)
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              available={food.available}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
