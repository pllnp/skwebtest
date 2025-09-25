document.addEventListener('DOMContentLoaded', function() {
  const scriptURL = "https://script.google.com/macros/s/AKfycbwkg29VK3ranqwU-KoBoctZWEWWzA9y2H_RHP7S0MFReWoSyoofpWrN0LLKQzxtVA9pmA/exec"; 

  const consultModal = document.getElementById('consultModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const detailBtn = document.getElementById('detailBtn');
  const detailModal = document.getElementById('detailModal');
  const closeDetailBtn = document.getElementById('closeDetailBtn');
  const moduleBtn = document.getElementById('moduleBtn');
  const popupBtn = document.getElementById('popupBtn');

  function openModal() {
    consultModal.style.display='flex';
    setTimeout(()=> consultModal.classList.add('show'), 10);
  }

  function closeModal() {
    consultModal.classList.remove('show');
    setTimeout(()=> consultModal.style.display='none', 300);
  }

  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', e => { if(e.target===consultModal) closeModal(); });

  detailBtn.addEventListener('click', ()=> detailModal.style.display='flex');
  closeDetailBtn.addEventListener('click', ()=> detailModal.style.display='none');
  window.addEventListener('click', e => { if(e.target===detailModal) detailModal.style.display='none'; });

  moduleBtn.addEventListener('click', (e)=>{
    const rect = moduleBtn.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if(clickX < rect.width / 2) openModal();
    else window.location.href = "tel:01012345678";
  });

popupBtn.addEventListener('click', async ()=>{
  const name = document.getElementById('modalName').value.trim();
  const phone = document.getElementById('modalPhone').value.trim();
  const agree = document.getElementById('agreeCheck').checked;
  const messageEl = document.getElementById('message');

  if(name === "" || !/^[0-9]{10,11}$/.test(phone)){
    messageEl.innerText = "이름과 전화번호를 올바르게 입력해주세요.";
    return;
  }

  if(!agree){
    messageEl.innerText = "개인정보 수집 및 이용에 동의해야 제출할 수 있습니다.";
    return;
  }

  messageEl.innerText = "제출 중...";

  try {
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('phone', phone);

    const res = await fetch(scriptURL, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.status === "ok") {
      messageEl.innerText = data.message;
      document.getElementById('modalName').value = '';
      document.getElementById('modalPhone').value = '';
      setTimeout(() => closeModal(), 1500);
    } else {
      messageEl.innerText = "제출 실패: " + data.message;
    }

  } catch (err) {
    messageEl.innerText = "서버 연결 실패";
    console.error(err);
  }
});
}); // <-- DOMContentLoaded 닫기
