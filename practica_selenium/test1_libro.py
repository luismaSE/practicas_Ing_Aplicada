# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class Test1libro():
  def setup_method(self, method):
    self.driver = webdriver.Firefox()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_libro(self):
    self.driver.get("https://biblioteca.um.edu.ar/")
    self.driver.find_element(By.ID, "translControl1").click()
    self.driver.find_element(By.ID, "translControl1").send_keys("ingenieria de software pressman")
    self.driver.find_element(By.CSS_SELECTOR, ".fa-search").click()
    self.driver.find_element(By.CSS_SELECTOR, "#title_summary_60481 > .title > .term:nth-child(1)").click()
  