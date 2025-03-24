import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, TextField, Button, Typography, CircularProgress, Box, Toolbar } from "@mui/material"
import { Image as ImageIcon } from "@mui/icons-material"

const CreateArticle = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    setImages(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i])
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/articles/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        navigate("/dashboard")
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Error creating article:", error)
      alert("Article creation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{
              color: "black",
              fontFamily: "'Georgia', serif",
              fontWeight: "bold",
            }}
          >
            Draft
          </Typography>
        </Toolbar>

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fff",
          pt: "64px", // Height of AppBar
          px: { xs: 2, md: 0 },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            py: 4,
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="  _Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: "42px",
                  fontWeight: "bold",
                  borderLeft:"3px solid grey",
                  fontFamily: "'Georgia', serif",
                  lineHeight: "60px",
                },
              }}
              sx={{
                mb: 4,
              }}
            />

            <TextField
              placeholder="  _Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              multiline
              required
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: "21px",
                  lineHeight: "32px",
                  paddingLeft:"15px",
                  borderLeft:"2.4px solid grey",
                  fontFamily: "'Georgia', serif",
                  color:"rgba(28, 27, 27, 0.54)"
                },
              }}
              sx={{
                mb: 4,
              }}
            />

            <Box
              sx={{
                position: "fixed",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "white",
                borderRadius: "24px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                component="label"
                startIcon={<ImageIcon />}
                sx={{
                  color: "rgba(0,0,0,0.54)",
                  textTransform: "none",
                }}
              >
                Add image
                <input type="file" multiple onChange={handleImageChange} hidden />
              </Button>
              {images.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  {images.length} image{images.length > 1 ? "s" : ""} selected
                </Typography>
              )}
            </Box>
            <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: "#1a8917",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 500,
              position:"fixed",
              top: "10%",
              textTransform: "none",
              px: 4,
              "&:hover": {
                backgroundColor: "#156912",
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Publish"}
          </Button>
          </form>
        </Container>
      </Box>
    </>
  )
}

export default CreateArticle

