import streamlit as st
import graphviz
import altair as alt
import pandas as pd

tab1, tab2, tab3 = st.tabs(["Line Chart", "Food Web", "Info"])

with tab1:        
    class Organism:
        def __init__(self, name, prey, volume, population):
            self.name = name
            self.prey = prey
            self.volume = volume
            self.population = population
            self.population_over_time = []
            self.time = []

        def grow(self):
            if self.prey == None:
                if self.population < 100:
                    self.population = self.population * (1 + (0.5 * ((110 - self.population) / 100)))

        def eat(self):
            if self.prey:                
                sum_prey = 0                
                for p in self.prey:
                    if p in food_chain.organisms:
                        sum_prey += p.population
                total_eats = 0
                if sum_prey == 0:
                        eats = 0
                else:
                    for p in self.prey:           
                        if p in food_chain.organisms:
                            eats = min(p.population / sum_prey * self.volume/10 * self.population, p.population/5)
                            self.population += eats
                            p.population -= eats
                            total_eats += eats
                # Starve!
                if sum_prey < self.volume * self.population:
                    self.population = self.population * 0.8       
            
        def die(self, iteration):
            self.population = max(self.population * 0.95, 0)
            self.time.append(iteration + 1)
            self.population_over_time.append(self.population)
            
    class FoodChain:
        def __init__(self):
            self.organisms = []

        def add_organism(self, organism):
            self.organisms.append(organism)


        def simulate(self, time):
            
            for a in options:
                if invader_choice and a != inv:
                    food_chain.add_organism(objects_dict[a])
                elif not invader_choice:
                    food_chain.add_organism(objects_dict[a])
                
            for i in range(time):                
                if invader_choice and i == int(invader_entry * time):
                    food_chain.add_organism(invader_object)
                    invader_object.population = inv_pop
                
                for organism in self.organisms:
                    organism.grow()
                    organism.eat()
                    organism.die(i)
                

        def print_population(self):
            st.write('----------')
            st.markdown('**Final Population**')
            for organism in self.organisms:
                st.write(f'{organism.name} population: {round(organism.population,1)}')
            
        
        def plot_population(self):
            # Create a dataframe for the chart
            df = pd.DataFrame()
            for organism in self.organisms:
                df = pd.concat([df, pd.DataFrame({'Time': organism.time, 'Population': organism.population_over_time, 'Name': organism.name})])
            # Create the chart
            chart = alt.Chart(df).mark_line().encode(
                x='Time',
                y='Population',
                color='Name',
            )

            chart.configure_axis(
                labelFontSize=20,
                titleFontSize=20
            )

            st.altair_chart(chart, use_container_width=True)



    # Ocean organisms
    plankton = Organism('Plankton', None, None, 100)
    seaweed = Organism('Seaweed', None, None, 100)
    krill = Organism('Krill', [plankton], 3, 50)
    jellyfish = Organism('Jellyfish', [krill, plankton], 3, 50)
    fish = Organism('Fish', [jellyfish, plankton, krill], 3, 50)
    shellfish = Organism('Shellfish', [plankton, seaweed], 3, 50)
    octopus = Organism('Octopus', [fish, shellfish], 3, 50)
    dolphin = Organism('Dolphins', [fish, octopus], 3, 10 )
    turtle = Organism('Turtles', [jellyfish, shellfish, seaweed], 3, 50)
    shark = Organism('Sharks', [turtle, fish], 3, 10)
    
    # Aus native organisms
    acacia = Organism('Acacia', None, None, 100)
    grass = Organism('Grasses', None, None, 100)
    insect = Organism('Insects', [acacia], 4, 50)
    bilby = Organism('Bilbies', [grass, insect], 3, 50)
    kangaroo = Organism('Kangaroos', [grass], 4, 50)
    snake = Organism('Snakes', [insect, bilby], 2, 50)
    eagle = Organism('Wedge-tailed Eagles', [snake, kangaroo], 2, 10)
    dingo = Organism('Dingoes', [bilby, kangaroo], 3, 10)
    cane_toad = Organism('Cane Toads', [insect], 3, 10)
    feral_cat = Organism('Feral Cats', [bilby, snake], 3, 10)
    

    


    # Config
    ocean = {'plankton':plankton, 'seaweed':seaweed, 'krill':krill, 'shellfish':shellfish, 'fish':fish, 'octopus':octopus,
    'jellyfish':jellyfish, 'turtle':turtle, 'dolphin':dolphin, 'shark':shark,
    }
    ausnative = {'acacia':acacia, 'grasses':grass, 'insects':insect, 'bilby':bilby,
    'kangaroo':kangaroo,'snake':snake, 'wedge-tailed eagle':eagle, 'dingo':dingo,
    'cane toads':cane_toad, 'feral cats':feral_cat}

    with st.sidebar:
        add_radio = st.radio(
            "Choose an ecosystem",
            ("Ocean", "Australian Native")
        )
        if add_radio == 'Ocean':
            objects_dict = ocean
            def_choice = ['plankton', 'fish', 'dolphin']
        else:
            objects_dict = ausnative
            def_choice = ['grasses', 'kangaroo', 'dingo']
        animals = objects_dict.keys()
        options = st.multiselect(
        'Fill your ecosystem with animals',
        animals, def_choice)
                
        time = st.slider('Select time', 0, 1000, 50)
        invader_choice = st.checkbox('Invader')

        if invader_choice:
            inv = st.selectbox(
            'Which is the invasive species?',
            animals, index=5)
            invader_object = objects_dict[inv]
            inv_pop = st.slider('Select invader starting population', 0, 100, 5)   
            inv_vor = st.select_slider('Select voraciousness of the invader',
            options=['low', 'medium', 'high', 'extreme'], value='medium')
            options_map = {'low':1, 'medium':3, 'high':5, 'extreme':10}
            invader_entry = 0.5 # fraction
            invader_object.volume = options_map[inv_vor]
            invader_object.population = inv_pop
            invader = [invader_object,invader_object.name]

    st.header(f'{add_radio} Food Web Simulation')
    # create food chain and add organisms
    food_chain = FoodChain()

    # simulate food chain for x time units
    
    food_chain.simulate(time)
    food_chain.plot_population()
    food_chain.print_population()
    
   

with tab2:
    col1, col2 = st.columns([2,1])
    with col1:
        st.header(f'{add_radio} Food Web')

        if add_radio == 'Ocean':
            dot_lang =         '''
            digraph {
                rankdir="BT"
                
                fish -> {octopi dolphins sharks}
                octopi -> {dolphins}
                turtles -> sharks        
                plankton -> {jellyfish fish krill}
                seaweed -> {krill shellfish turtles}
                rank = same;
                shellfish -> {fish turtles octopi}       
                krill -> {jellyfish fish}
                jellyfish -> {turtles fish}
                

            }
           
        '''
        else:
            dot_lang =  '''
            digraph {
                rankdir="BT"
                
                wattles -> {insects}
                grasses -> {bilbies kangaroos }
                insects -> {snakes bilbies "cane toads"}        
                bilbies -> {"feral cats" snakes dingoes}
                rank = same;
                kangaroos -> {dingoes eagles}
                
                snakes -> {"feral cats"  eagles}       
                

            }
           
        '''
        st.graphviz_chart(dot_lang)
            

        st.write('---')
        for organism in objects_dict:
            if objects_dict[organism].prey == None:
                st.write(f'{objects_dict[organism].name} are at the bottom of the food chain.')
            else:
                preys = ""
                for p in range(len(objects_dict[organism].prey)-1):
                    preys += f'{objects_dict[organism].prey[p].name}, '
                if len(objects_dict[organism].prey) == 1:
                    preys += f'{objects_dict[organism].prey[-1].name}'
                else:
                    preys += f'and {objects_dict[organism].prey[-1].name}'
                
                st.write(f'{objects_dict[organism].name} eat {preys}')
                
    with col2:
        if add_radio == 'Ocean':
            st.image("https://th.bing.com/th/id/OIP.jo0GE0vdx_AkOWF22lMU3wAAAA?w=192&h=217&c=7&r=0&o=5&dpr=1.3&pid=1.7", width=150)
            st.image("https://th.bing.com/th/id/OIP.rY3fKEXVJPlOyGtxJli3xAAAAA?pid=ImgDet&rs=1", width=150)
            st.image("https://th.bing.com/th/id/R.ec76a8b43dd7058fea8ec3de000fd07a?rik=P88eYGz7GEJbww&riu=http%3a%2f%2fwww.mysciencebox.org%2ffiles%2fimages%2fplankton.jpg&ehk=bpacRGYA%2fvhRW0jibE80ZGNazuQ35lHdJHjSBZyzi1Y%3d&risl=&pid=ImgRaw&r=0", width=150)
            st.image("https://th.bing.com/th/id/OIP.z5UCbdyfZI3hGtTb8mfV0QAAAA?pid=ImgDet&rs=1", width=150)
            st.image("https://th.bing.com/th/id/OIP.R2hPDXncY582dpmHetWyfgAAAA?pid=ImgDet&rs=1", width=150)
        else:
            st.image("https://www.researchgate.net/profile/Elizabeth-Makings/publication/327582551/figure/fig61/AS:670697848336393@1536918236700/Stipa-capulata-dominated-steppe-grassland-Tien-Shan-Kyrgyzstan-from-an-expedition-with_Q320.jpg", width=150)
            st.image("https://th.bing.com/th/id/OIP.zlsPJyFtajswMwsvO--rTwAAAA?w=216&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7", width=150)
            st.image("https://th.bing.com/th/id/OIP.qTLS8FMa6Aag5AF4hfty7wAAAA?w=172&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",width=150)
            st.image("https://th.bing.com/th/id/OIP.2IBLzoSCj-UsB5FTEuCfiAAAAA?w=154&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",width=150)
            st.image("https://th.bing.com/th/id/OIP.4MqHmvB43SMBlY3wWaOH1wAAAA?w=201&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",width=150)

with tab3:

    st.header('Info')

    st.write('Choose an ecosystem and fill it with animals of your choosing. Then, set the number \
    of iterations (time)')
    
    st.write('Animals exist in a simulated food web, consisting of **primary producers** at the base of \
    the food chain, like plankton, seaweed or grasses, then **herbivorous and carnivorous consumers** like \
    kangaroos or shellfish, and finally **apex predators** like dingoes or sharks.')
    st.write('Each iteration, animals will do the following:')
    st.markdown(''' 
    - **Eat**: Consumes food proportionately from each food source. (i.e. An Octopus eats fish \
    and shellfish. If there were 20 fish and 10 shellfish, it would consume 67% fish and 33% shellfish). \
    Primary producers are excluded, as they derive their growth from sunlight.
    - **Starve**: If the food sources are insufficient to meet the animal's needs, the animal goes hungry \
    and its population is reduced by 20%.
    - **Die**: The population is reduced by 5% at the end of each iteration to simulate natural death
    ''')
    st.write('Have fun exploring the simulation and experimenting with different combinations of starting \
    animals and invaders! Does your ecosystem reach an equilibrium? How do invaders affect the \
    ability of the ecosystem to function? ') 
    st.image("https://fsmedia.imgix.net/9c/0a/ca/a7/ef46/4a6d/900e/9e38c87d41c5/coral-glow-brighter-just-before-they-die.jpeg?rect=0%2C132%2C1894%2C947&dpr=2&auto=format%2Ccompress&w=650")