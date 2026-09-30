import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectList from "./components/ProjectList";
import TimelineList from "./components/TimelineList";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProjectList />
        <TimelineList />
      </main>
      <Contact />
    </>
  );
}

export default App;
