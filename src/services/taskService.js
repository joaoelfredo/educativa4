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
 * Prepara os dados antes de enviar para o backend, garantindo que
 * datas fiquem no formato ISO-8601 exigido pelo Prisma.
 */
const prepareDataForBackend = (data) => {
    if (!data) return data;
    const formatted = { ...data };
    
    if (formatted.dueDate) {
        if (typeof formatted.dueDate === 'string' && formatted.dueDate.includes('/')) {
            const [day, month, year] = formatted.dueDate.split('/');
            if (day && month && year) {
                formatted.dueDate = new Date(`${year}-${month}-${day}T12:00:00.000Z`).toISOString();
            }
        } else if (typeof formatted.dueDate === 'string' && formatted.dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Se já vier no formato "YYYY-MM-DD", apenas adicionamos o horário para garantir o ISO-8601
            formatted.dueDate = new Date(`${formatted.dueDate}T12:00:00.000Z`).toISOString();
        } else {
            const parsedDate = new Date(formatted.dueDate);
            if (!isNaN(parsedDate.getTime())) {
                formatted.dueDate = parsedDate.toISOString();
            }
        }
    }
    
    return formatted;
};

/**
 * Cria uma nova tarefa
 * @param {object} taskData - Dados formatados pelo AddTaskModal (ex: type em MAIÚSCULO)
 * @returns {Promise<object>} Tarefa criada no formato do Frontend
 */
export const createTask = async (taskData) => {
    try {
        console.log('[taskService] Criando nova tarefa (dados para backend):', taskData);
        
        const backendData = prepareDataForBackend(taskData);
        const response = await api.post('/task', backendData);
        
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
        
        const backendData = prepareDataForBackend(taskData);
        const response = await api.put(`/task/${taskId}`, backendData);
        
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