import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Box,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";

// Registrar os componentes necessários no Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

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

    const chartData = {
        labels: security.prices.map((p) => p.date),
        datasets: [
            {
                label: "Close Price ($)",
                data: security.prices.map((p) => p.close_price),
                borderColor: blue[500],
                backgroundColor: "rgba(33, 150, 243, 0.1)",
                tension: 0.3,
                yAxisID: "y",
            },
            {
                label: "Volume (in millions)",
                data: security.prices.map((p) => p.volume / 1e6),
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                tension: 0.3,
                yAxisID: "y1",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            y: {
                type: "linear" as const,
                position: "left" as const,
                title: {
                    display: true,
                    text: "Close Price ($)",
                    font: {
                        size: 14,
                    },
                },
            },
            y1: {
                type: "linear" as const,
                position: "right" as const,
                title: {
                    display: true,
                    text: "Volume (in millions)",
                    font: {
                        size: 14,
                    },
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
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
                <Typography
                    variant="h5"
                    sx={{ textAlign: "center", fontWeight: "bold", mb: 2, color: blue[700] }}
                >
                    Price and Volume Trends
                </Typography>
                <Line data={chartData} options={chartOptions} />
            </Card>
        </Container>
    );
};

export default SecurityDetail;