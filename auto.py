from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait as wait
import time
import pickle

chrome_options = ChromeOptions()
chrome_options.add_argument("load-extension=C:/work_goji/testing/build") #needs to point to the test build!!!!

#chrome_options.add_extension('build.crx')

driver = webdriver.Chrome('./chromedriver', options=chrome_options)

unpacked_ext_path = "build.crx"
website_path_1 = "https://goji-oscar1.gojitech.systems/oscar/index.jsp"
website_path_2 = "https://accounts.google.com/ServiceLogin"
website_path_3 = "chrome://extensions/"

#Login info
userName = ""
passWord = ""
pin = ""


#Login info google
userName_g = ""
passWord_g = ""

#Put into a function so it can be sent to other files easily.
def myFunc(website_path_1,website_path_2,website_path_3,userName,passWord,pin,userName_g,passWord_g):
    #Google signin instructions
    driver.get(website_path_2)

    user_g_input = driver.find_element_by_id('identifierId')
    user_g_input.send_keys(userName_g);

    next_g_input = driver.find_element_by_id('identifierNext')
    next_g_input.click();

    time.sleep(2) 
    #Makes the code stop for a couple seconds, 
    #this stops the automation from putting the password in the username box.

    pass_g_input = driver.find_element_by_xpath("//input[@class='whsOnd zHQkBf']")
    pass_g_input.send_keys(passWord_g)

    next_g2_input = driver.find_element_by_id('passwordNext')
    next_g2_input.click();

    #This is for OSCARAPI

    #login 
    driver.get(website_path_1)

    user_input = driver.find_element_by_id('username')
    user_input.send_keys(userName)

    password_input = driver.find_element_by_id('password')
    password_input.send_keys(passWord)

    pin_input = driver.find_element_by_id('pin')
    pin_input.send_keys(pin)

    login_button = driver.find_element_by_xpath("//input[@name='submit' and @value='OSCAR Classic']")
    login_button.click();

    time.sleep(2) #Gives time to load, so it can click the next button.

    #Begins actual testing.

    goji_button = driver.find_element_by_id('extension_btn')
    goji_button.click();

    iframe = driver.find_element_by_xpath("//iframe[@id='popup-content']") #switches to iframe panel
    driver.switch_to.frame(iframe) # ^
    wait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Sign in with Google']"))).click()

    time.sleep(30) #login api, manual

    wait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Home']"))).click()

    wait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Create a Prescription']"))).click()

#Run command
myFunc(website_path_1,website_path_2,website_path_3,userName,passWord,pin,userName_g,passWord_g)