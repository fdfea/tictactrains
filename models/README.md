# **TicTacTrains Models**

### **Summary**

Several Python machine learning models were created to predict the outcome of a TicTacTrains game given some data about the final state to improve the performance of the AI. The libraries leveraged were scikit-learn, keras, and pandas. Some of these models were incorporated into the [engine](../engine/). For more information about how the models work and what data they use, see the description in the [engine](../engine/README.md). 

### **Usage**
To use these models, you must first obtain some data using the [data generation](../original/) module, or you can use the sample data provided (Note: the data provided is very small so it may not yield similar results). To test a model, make sure the data you wish to test is in the `data/` directory. Then, edit the file of the model you wish to run to include the name of the data file to load from. Finally, run `python <model_file_name>.py`. 
