import express from 'express';

const app = express();
app.use(express.json());

const defaultTimes = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

let daysCollection = [
  {
    date: "2023-07-29",
    timesAvail: ["11:00", "11:30", "12:00",],
    bookings: [
      {
        Time: "12:30",
        Service: "Studio Shooting",
        Product: "Solo (1 Person)",
        Details: [
          {
            outfits: 1,
            makeup: 0
          }
        ],
        Edited_Photos: {
          Total: 3,
          Included: 2,
          Extra: 1
        },
        Total_Cost: 7000,
        Contact: {}
      }
    ]
  }
]

app.get('/api/availability/:viewedDayISO', (req, res) => {
  const {viewedDayISO} = req.params;
  const day = daysCollection.find(day => day.date === viewedDayISO);
  if (day) {
    res.send(day.timesAvail);
  } else {
    res.send(defaultTimes);
  }
});

/* ******************** */

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});