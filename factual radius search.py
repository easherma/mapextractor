
# coding: utf-8

# In[13]:

import pandas as pd
import csv
import json
from factual import Factual
import time
import requests


factual = Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow')
    
places = factual.table('places')

from factual.utils import circle
data = places.search('auto repair').geo(circle(41.910753, -87.697108, 1000)).data()
df = pd.DataFrame(data)
out = json.dumps(data)
df.to_csv("test1.csv")


# In[ ]:



