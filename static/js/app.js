function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(metadata){
    console.log(metadata)
    var metaDump = d3.select("#sample-metadata");
    metaDump.html("");

    var count = 0

    Object.entries(metadata).forEach(function([key, value]){
      metaDump.append("p").attr("class", `meta meta${count}`).html(`<b>${key.toUpperCase()}: ${value}</b>`);
      count += 1;
    });

    d3.select(".meta5").remove();
    d3.select(".meta6").html(`<b>SAMPLEID: ${sample}</b>`)

    buildGauge(metadata.WFREQ)
  })
};

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then(function(data){
    console.log(data);
    // PIE
    var labels = data.otu_ids.slice(0,10);
    var values = data.sample_values.slice(0,10);
    var names = data.otu_labels.slice(0,10);

    var tracePie = {
      labels: labels,
      values: values,
      names: labels,
      text: names,
      textinfo: 'value',
      type: "pie"};
    var dat = [tracePie];

    var layout = {
      paper_bgcolor:'rgb(87, 207, 255)',
      plot_bgcolor:"rgb(87, 207, 255)",
      margin: {
        t: 0,
        b: 0,
        l: 0,
        r: 0
      }
    }

    Plotly.newPlot("pie", dat, layout);

    // BUBBLE
    var traceBubble = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Earth"
      }
    };
    var data2 = [traceBubble]

    var layout = {
      title: "Bubble Chart",
      paper_bgcolor:'rgb(87, 207, 255)',
      plot_bgcolor:"rgb(87, 207, 255)",
      xaxis: {title: "OTU ID"}
    }
    
    Plotly.newPlot("bubble", data2, layout);
    
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(`BB_${sample}`)
        
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
