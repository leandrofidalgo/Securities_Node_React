import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";

interface PriceData {
  date: string;
  close_price: number;
  volume: number;
}

interface SecurityDetail {
  symbol: string;
  name: string;
  sector: string;
  country: string;
  prices: PriceData[];
}

const SecurityDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [security, setSecurity] = useState<SecurityDetail | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/securities/${symbol}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setSecurity(data);
      });
  }, [symbol]);

  if (!security)
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2, color: grey[700] }}>
          Loading data...
        </Typography>
      </Container>
    );

  const chartOptions = {
    chart: {
      type: "line",
    },
    title: {
      text: "Price/Volume History",
    },
    xAxis: {
      categories: security.prices.map((p) => p.date),
    },
    yAxis: [
      {
        title: {
          text: "Close Price",
        },
      },
      {
        title: {
          text: "Volume (in millions)",
        },
        opposite: true,
      },
    ],
    series: [
      {
        name: "Close Price ($)",
        data: security.prices.map((p) => p.close_price),
        color: "blue",
        yAxis: 0,
      },
      {
        name: "Volume (in millions)",
        data: security.prices.map((p) => p.volume / 1e6),
        color: "red",
        yAxis: 1,
      },
    ],
    tooltip: {
      shared: true,
    },
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Card
        sx={{
          p: 3,
          backgroundColor: blue[50],
          borderRadius: 3,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: blue[700] }}>
                {security.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                <strong>Symbol:</strong> {security.symbol}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                <strong>Sector:</strong> {security.sector}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                <strong>Country:</strong> {security.country}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={() => navigate("/securities")}
                sx={{ borderRadius: 2 }}
              >
                Back to Securities
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 4, p: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Card>
    </Container>
  );
};

export default SecurityDetail;
