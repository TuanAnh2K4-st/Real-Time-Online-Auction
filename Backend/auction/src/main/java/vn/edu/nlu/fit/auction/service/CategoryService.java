package vn.edu.nlu.fit.auction.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.nlu.fit.auction.entity.Category;
import vn.edu.nlu.fit.auction.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    // create
    public Category create(String name, Integer parentId) {
        Category c = new Category();
        c.setName(name);

        if (parentId != null) {
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            c.setParent(parent);
        }

        return categoryRepository.save(c);
    }

    // Update
    public Category update(Integer id, String name, Integer parentId) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        c.setName(name);

        if (parentId != null) {
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            c.setParent(parent);
        } else {
            c.setParent(null);
        }

        return categoryRepository.save(c);
    }

    // Delete
    public void delete(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }
}
