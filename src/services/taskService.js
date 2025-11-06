import api  from './api';


const mapTaskFromApi = (apiTask) => {
    if (!apiTask || !apiTask.dueDate) {
        console.error("Recebido 'apiTask' inválido no mapTaskFromApi:", apiTask);
        return null; 
    }
    const taskDate = apiTask.dueDate.split('T')[0]; 
    
    return {
        id: apiTask.id,
        title: apiTask.title,
        date: taskDate, 
        dueDate: new Date(apiTask.dueDate).toLocaleDateString('pt-BR'), 
        notes: apiTask.notes,
        type: apiTask.type.toLowerCase(), 
        icon: apiTask.icon,
        color: apiTask.color,
        completed: apiTask.completed,
        hasReminder: apiTask.hasReminder,
        reminderTime: apiTask.reminderTime,
        userId: apiTask.userId,
    };
};

/**
 * Cria uma nova tarefa
 * @param {object} taskData - Dados formatados pelo AddTaskModal (ex: type em MAIÚSCULO)
 * @returns {Promise<object>} Tarefa criada no formato do Frontend
 */
export const createTask = async (taskData) => {
    try {
        console.log('[taskService] Criando nova tarefa (dados para backend):', taskData);
        
        const response = await api.post('/task', taskData);
        
        const newTaskFromApi = response.data.newTask;
        console.log('[taskService] Resposta da API:', newTaskFromApi);
        
        return mapTaskFromApi(newTaskFromApi);

    } catch (error) {
        console.error('Erro em createTask:', error.response?.data || error.message);
        throw error; 
    }
};

/**
 * Atualiza uma tarefa existente
 * @param {string} taskId - ID da tarefa
 * @param {object} taskData - Dados para atualizar
 * @returns {Promise<object>} Tarefa atualizada no formato do Frontend
 */
export const updateTask = async (taskId, taskData) => {
    try {
        console.log(`[taskService] Atualizando tarefa ${taskId}:`, taskData);
        
        const response = await api.put(`/task/${taskId}`, taskData);
        
        const updatedTaskFromApi = response.data.taskForUpdate;
        console.log('[taskService] Resposta da API (update):', updatedTaskFromApi);
        
        return mapTaskFromApi(updatedTaskFromApi);
    } catch (error) {
        console.error('Erro em updateTask:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Busca todas as tarefas do usuário
 * @returns {Promise<Array>} Lista de tarefas formatadas para o Frontend
 */
export const fetchTasks = async () => {
    try {
        console.log('[taskService] Buscando tarefas...');
        
        const response = await api.get('/task'); 
        
        const tasksFromApi = Array.isArray(response.data.tasks) ? response.data.tasks : [];
        
        const tasksMapeadas = tasksFromApi.map(mapTaskFromApi).filter(task => task !== null); 

        console.log('[taskService] Tarefas mapeadas:', tasksMapeadas.length);
        return tasksMapeadas;
    } catch (error) {
        console.error('Erro em fetchTasks:', error.response?.data || error.message);
        throw new Error('Falha ao carregar tarefas. Sua sessão pode ter expirado.');
    }
};

/**
 * Deleta uma tarefa
 * @param {string} taskId - ID da tarefa
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId) => {
    try {
        console.log('[taskService] Deletando tarefa:', taskId);
        
        await api.delete(`/task/${taskId}`);
        console.log('[taskService] Tarefa deletada com sucesso no backend');
    } catch (error) {
        console.error('Erro em deleteTask:', error.response?.data || error.message);
        throw error;
    }
};