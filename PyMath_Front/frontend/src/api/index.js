import axios from 'axios';
//This class primarily implements API, each of which is thoroughly annotated in the backend for explanation
const baseUrl = 'http://localhost:3030';

export const reqSendEmail = async (emailAddress) => {
    try {
      const response = await axios.put(`${baseUrl}/public/User/send-email`, null, {
        params: { emailAddress }
      });
      return response.data;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };
  

export const verifyEmail = async (emailAddress, userCaptcha) => {
  const response = await axios.put(`${baseUrl}/public/User/verify-email`, null, {
    params: { emailAddress, userCaptcha }
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.put(`${baseUrl}/public/User/login`, null, {
    params: { email, password }
  });
  return response.data;
};

export const registerUser = async (email, username, role, password, birthday, ageGroup, institution, realName, idCard, safeQ, safeA) => {
  const response = await axios.post(`${baseUrl}/public/User/register`, null, {
    params: {
      email,
      username,
      role,
      password,
      birthday,
      ageGroup,
      institution,
      realName,
      idCard,
      safeQ,
      safeA
    }
  });
  return response.data;
};

export const getSafeQuestion = async (email) => {
  const response = await axios.get(`${baseUrl}/public/User/safequestion`, {
    params: { email }
  });
  return response.data;
};

export const verifySafeAnswer = async (email, userSafeAnswer) => {
  const response = await axios.post(`${baseUrl}/public/User/verifysafeanswer`, null, {
    params: { email, userSafeAnswer }
  });
  return response.data;
};

export const changePassword = async (email, newPassword) => {
  const response = await axios.put(`${baseUrl}/public/User/changepassword`, null, {
    params: { email, newPassword }
  });
  return response.data;
};

export const changeInfoUserend = async (email, username, birthday, ageGroup, institution, realName, idCard) => {
  const response = await axios.put(`${baseUrl}/public/User/changeinfouserend`, null, {
    params: {
      email,
      username,
      birthday,
      ageGroup,
      institution,
      realName,
      idCard
    }
  });
  return response.data;
};

export const changeInfoAdminend = async (email, safeQuestion, safeAnswer, adminEmail, adminPass) => {
  const response = await axios.put(`${baseUrl}/public/User/changeinfoadminend`, null, {
    params: {
      email,
      safeQuestion,
      safeAnswer,
      adminEmail,
      adminPass
    }
  });
  return response.data;
};

export const deleteUser = async (email, adminEmail, adminPass) => {
  const response = await axios.delete(`${baseUrl}/public/User/deleteUser`, {
    params: {
      email,
      adminEmail,
      adminPass
    }
  });
  return response.data;
};

export const getUserList = async (current, type, username, email, userId) => {
  const response = await axios.get(`${baseUrl}/public/User/getUserList`, {
    params: {
      current,
      type,
      username,
      email,
      userId
    }
  });
  return response.data;
};


// 验证答案
export const verifyAnswer = async (code, questionID) => {
  try {
    const response = await axios.put(`${baseUrl}/public/Question/verifyAnswer`, null, {
      params: { code, questionID }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const runCode = async (code) => {
  try {
    const response = await axios.put(`${baseUrl}/public/Question/runCode`, null, {
      params: { code}
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 提供答案
export const provideAnswer = async (questionID, answer, adminEmail, adminPass, answerExplain) => {
  try {
    const response = await axios.post(`${baseUrl}/public/Question/provideAnswer`, null, {
      params: { questionID, answer, adminEmail, adminPass, answerExplain }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 添加问题
export const addQuestion = async (question, level, type, ageGroup, email) => {
  try {
    const response = await axios.post(`${baseUrl}/public/Question/addQuestion`, null, {
      params: { question, level, type, ageGroup, email }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 编辑答案
export const editAnswer = async (questionID, answer, adminEmail, adminPass, answerExplain) => {
  try {
    const response = await axios.put(`${baseUrl}/public/Question/editAnswer`, null, {
      params: { questionID, answer, adminEmail, adminPass, answerExplain }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 删除问题
export const deleteQuestion = async (email, questionId) => {
  try {
    const response = await axios.delete(`${baseUrl}/public/Question/deleteQuestion`, {
      params: { email, questionId }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 获取用户问题列表
export const getQuestionsByPage = async (current,email,questionType,startDate,endDate) => {
  try {
    const response = await axios.get(`${baseUrl}/public/History/getQuestionsByPage`, {
      params: { current, email, questionType, startDate, endDate }
    }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getBeforeQuestion = async (email, questionId) => {
  try {
    const response = await axios.get(`${baseUrl}/public/Question/getBeforeQuestion`, {
      params: { email, questionId }
    }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAfterQuestion = async (email,questionId) => {
  try {
    const response = await axios.get(`${baseUrl}/public/Question/getAfterQuestion`, {
      params: { email, questionId}
    }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 获取不同类型
export const getDistinctTypes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/public/Question/getDistinctTypes`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 获取问题
export const getQuestions = async (current, questionID, questionContent, type, ageGroup, hasAnswer, email, startDate, endDate) => {
  try {
    const response = await axios.get(`${baseUrl}/public/Question/getQuestions`, {
      params: { current, questionID, questionContent, type, ageGroup, hasAnswer, email, startDate, endDate }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 编辑问题
export const editQuestion = async (email, questionId, question, type, ageGroup, level) => {
  try {
    const response = await axios.put(`${baseUrl}/public/Question/editQuestion`, null, {
      params: { email, questionId, question, type, ageGroup, level }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 提交问题
export const submitQuestion = async (senderEmail, receiverEmail, questionId) => {
  try {
    const response = await axios.post(`${baseUrl}/public/Message/submitQuestion`, null, {
      params: { senderEmail, receiverEmail, questionId }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 创建新消息
export const createMessage = async (senderEmail, content) => {
  try {
    const response = await axios.post(`${baseUrl}/public/Message/createMessage`, null, {
      params: { senderEmail, content }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 回复消息
export const replyMessage = async (sender, receiver, content, threadId) => {
  try {
    const response = await axios.post(`${baseUrl}/public/Message/replyMessage`, null, {
      params: { sender, receiver, content, threadId }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 通过接收者获取消息
export const getMessageByReceiver = async (current, email) => {
  try {
    const response = await axios.get(`${baseUrl}/public/Message/getMessageByReceiver`, {
      params: { current, email }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 通过Thread ID获取消息
export const getMessageByThread = async (current, threadId) => {
  try {
    const response = await axios.get(`${baseUrl}/public/Message/getMessageByThread`, {
      params: { current, threadId }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 通过问题ID删除消息
export const deleteMessagesByQuestionId = async (questionId) => {
  try {
    const response = await axios.delete(`${baseUrl}/public/Message/DeleteByQuestion`, {
      params: { questionId }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 通过消息ID删除消息
export const deleteMessageById = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/public/Message/DeleteById`, {
      params: { id }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// 通过Thread ID删除消息
export const deleteMessagesByThreadId = async (threadId) => {
  try {
    const response = await axios.delete(`${baseUrl}/public/Message/DeleteByThreadId`, {
      params: { threadId }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getHistoryList = async (current, emailAddress, Type, start, end) => {
  try {
    const response = await axios.get(`${baseUrl}/public/History/getHistoryList`, {
      params: {
        current,
        emailAddress,
        Type,
        start,
        end
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const addHistory = async (email, Question_Id, Answer, Feedback, Type) => {
  try {
    const response = await axios.post(`${baseUrl}/public/History/addHistory`, null, {
      params: {
        email,
        Question_Id,
        Answer,
        Feedback,
        Type
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getLastQuestion = async (email, Type) => {
  try {
    const response = await axios.get(`${baseUrl}/public/History/lastQuestion`, null, {
      params: {
        email,
        Type
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};



