// Başlangıç puanını 0 olarak ayarla, ya da localStorage'dan al
let gliderScore = localStorage.getItem('gliderScore') ? parseInt(localStorage.getItem('gliderScore')) : 0;

// Puanı güncelleme fonksiyonu
function updateScore(newScore) {
    gliderScore = newScore;
    localStorage.setItem('gliderScore', gliderScore); // Puanı localStorage'a kaydet
    document.getElementById("glider-score").textContent = `GLDER: ${gliderScore}`; // Puanı ekrana yazdır
}

// Sayfa yüklendiğinde yapılacaklar
document.addEventListener("DOMContentLoaded", () => {
    // Görevlerin durumlarını kontrol et ve soluklaştır
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const taskId = task.getAttribute('id');
        
        // Eğer görev tamamlandıysa, görevi soluklaştır ve tıklanamaz hale getir
        if (localStorage.getItem(taskId)) {
            task.style.opacity = 0.5;
            task.style.pointerEvents = 'none';
        }
    });

    // 5 saniye sonra ana oyun ekranına geçiş yap
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "flex";
        showPage('home-content'); // Başlangıçta ana sayfa içeriğini göster
    }, 5000);

    // Server'dan kullanıcı adı bilgisini almak için fetch API kullanıyoruz
    fetch('https://e185-31-155-29-50.ngrok-free.app/webhook', { // Buraya server URL'yi ekleyin
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: {
                from: {
                    username: "testUser"  // Burada bot ile alınacak gerçek kullanıcı adı olacaktır.
                }
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Server yanıtı başarısız');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);  // Server'dan gelen veriyi incelemek için
        if (data.username) {
            const telegramUsernameElement = document.getElementById('telegram-username');
            telegramUsernameElement.textContent = `Kullanıcı: ${data.username}`;  // Kullanıcı adını ekrana yazdır
        } else {
            console.error('Kullanıcı adı alınamadı.');
        }
    })
    .catch(error => {
        console.error('Hata oluştu:', error);
    });
});

// Sayfa geçişi fonksiyonu
function showPage(pageId) {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.classList.remove('active'));
    
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active'); // Sayfayı göster
    } else {
        console.error(`Page with ID '${pageId}' not found.`);
    }
}

// Sosyal medya görevini tamamladığında puan kazandırma
function earnPoints(points) {
    const taskId = `task-${points}`;
    const taskElement = document.getElementById(taskId);

    if (localStorage.getItem(taskId)) {
        // Görev zaten tamamlanmışsa, uyarı mesajı göster
        alert('Bu görevi zaten tamamladınız!');
    } else {
        // Görev tamamlanmamışsa, puan ekle
        updateScore(gliderScore + points);
        
        // Görevi tamamlandığını işaretle
        localStorage.setItem(taskId, 'completed');
        
        // Görevi soluk hale getir ve tıklanamaz hale getir
        taskElement.style.opacity = 0.5;
        taskElement.style.pointerEvents = 'none';
    }
}
