export default function CurrentFocus() {
  const focus = [
    {
      title: "AI & Machine Learning",
      description:
        "Working on computer vision projects exploring how machines understand images, including experiments with visual datasets and art",
    },
    {
      title: "Building Small Products",
      description:
        "Experimenting with small applications and tools such as Chrome extensions and other productivity tools",
    },
    {
      title: "Learning in Public",
      description:
        "Deepening my understanding of JavaScript while writing articles that explain concepts like the event loop and debugging",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-semibold mb-12">Current Focus</h2>

      <div className="grid md:grid-cols-3 gap-12">
        {focus.map((item, i) => (
          <div key={i}>
            <h3 className="text-lg font-medium mb-3">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}