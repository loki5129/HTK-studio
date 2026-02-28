import json
import plotly.express as px

# Read JSON file
with open("data.json", "r") as f:
    data = json.load(f)  # json.load, not json.loads

population = data["population"]

fitness_values = [ind["fitness"] for ind in population]
individuals = list(range(1, len(population)+1))

fig = px.bar(
    x=fitness_values,
    y=individuals,
    orientation='h',
    labels={"x": "Fitness", "y": "Individual"},
    title="Population Fitness"
)

fig.show()
