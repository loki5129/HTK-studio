import json
import plotly.express as px
import pandas as pd

with open("fitness.json", "r") as f:
    data = json.load(f)

# Make sure this is numeric
population = data["population"]

fitness_values = [ind["fitness"] for ind in population]

df = pd.DataFrame({
    "Individual": range(1, len(fitness_values) + 1),
    "Fitness": fitness_values
})

fig = px.bar(
    df,
    x="Fitness",
    y="Individual",
    orientation="h",
    title="Population Fitness"
)

fig.show()
