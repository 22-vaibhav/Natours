import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }

    // If user data is updated (not the password)
    if (type === 'data') {
      const updatedUser = res.data.data.user;

      // this will instantly update photo in DOM
      const navImg = document.querySelector('.nav__user-img');
      const formImg = document.querySelector('.form__user-photo');

      if (navImg) navImg.src = `/img/users/${updatedUser.photo}`;
      if (formImg) formImg.src = `/img/users/${updatedUser.photo}`;

      // this will then reload after short delay
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
