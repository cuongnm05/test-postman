import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def run_smoke_test():
    print("[SELENIUM] Đang khởi chạy Chrome Headless Browser...")
    options = webdriver.ChromeOptions()
    options.add_argument('--headless') # Chạy ngầm không hiển thị UI
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        # Step 1: Truy cập trang chủ
        driver.get("http://localhost:3000")
        time.sleep(1)

        # Step 2: Kiểm tra tiêu đề (Assert)
        title_element = driver.find_element(By.ID, "welcome-title")
        assert "Chào mừng đến với E-Shop" in title_element.text
        print("✓ Ca 1: Truy cập trang chủ thành công.")

        # Step 3: Click nút 'Xem Sản Phẩm'
        btn = driver.find_element(By.ID, "btn-shop-now")
        btn.click()
        time.sleep(2)

        # Step 4: Kiểm tra danh sách sản phẩm hiển thị
        products = driver.find_elements(By.CLASS_NAME, "product-item")
        assert len(products) > 0
        print(f"✓ Ca 2: Đã tải thành công {len(products)} sản phẩm lên giao diện.")

        print("\n[SELENIUM SUCCESS] Tất cả ca kiểm thử chức năng Smoke Test ĐÃ ĐẠT!")

    except Exception as e:
        print(f"\n[SELENIUM FAILED] Kiểm thử thất bại: {e}")
        exit(1) # Trả về lỗi để CI/CD nhận biết
    finally:
        driver.quit()

if __name__ == "__main__":
    run_smoke_test()